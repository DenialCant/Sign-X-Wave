from flask_cors import CORS
from flask import Flask, request, jsonify
import threading
import csv
import copy
import argparse
import itertools

import cv2 as cv
import numpy as np
import mediapipe as mp

from utils.cvfpscalc import CvFpsCalc
from model.keypoint_classifier.keypoint_classifier import KeyPointClassifier

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Global variables to store the target sign and its corresponding ID
target_sign = "A"  # Default target sign is 'A'
target_sign_id = None  # To be set dynamically based on target_sign
keypoint_classifier_labels = []  # This will store the classifier labels


def get_args():
    parser = argparse.ArgumentParser()

    parser.add_argument("--device", type=int, default=0)
    parser.add_argument("--width", help="cap width", type=int, default=960)
    parser.add_argument("--height", help="cap height", type=int, default=540)

    parser.add_argument("--use_static_image_mode", action="store_true")
    parser.add_argument(
        "--min_detection_confidence",
        help="min_detection_confidence",
        type=float,
        default=0.7,
    )
    parser.add_argument(
        "--min_tracking_confidence",
        help="min_tracking_confidence",
        type=int,
        default=0.5,
    )

    args = parser.parse_args()
    return args


@app.route('/set-target-sign', methods=['POST'])
def set_target_sign():
    global target_sign, target_sign_id  # Ensure global scope access

    try:
        data = request.get_json()
        new_target_sign = data.get('target_sign', None)
        if new_target_sign and new_target_sign in keypoint_classifier_labels:
            target_sign = new_target_sign
            target_sign_id = keypoint_classifier_labels.index(target_sign)
            print(f"Updated target sign to: {target_sign}")
            return jsonify({"message": f"Target sign set to {target_sign}"}), 200
        else:
            return jsonify({"error": "Invalid sign or sign not found"}), 400
    except Exception as e:
        print(f"Error setting target sign: {e}")
        return jsonify({"error": "Failed to set target sign"}), 500


def start_flask():
    app.run(debug=False, host='0.0.0.0', port=5000, use_reloader=False)


def main():
    global keypoint_classifier_labels, target_sign, target_sign_id  # Ensure these are accessible

    # Argument parsing
    args = get_args()
    cap_device = args.device
    cap_width = args.width
    cap_height = args.height
    use_static_image_mode = args.use_static_image_mode
    min_detection_confidence = args.min_detection_confidence
    min_tracking_confidence = args.min_tracking_confidence
    use_brect = True

    # Camera preparation
    cap = cv.VideoCapture(cap_device)
    cap.set(cv.CAP_PROP_FRAME_WIDTH, cap_width)
    cap.set(cv.CAP_PROP_FRAME_HEIGHT, cap_height)

    # Model load
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(
        static_image_mode=use_static_image_mode,
        max_num_hands=2,
        min_detection_confidence=min_detection_confidence,
        min_tracking_confidence=min_tracking_confidence,
    )

    keypoint_classifier = KeyPointClassifier()

    # Read labels
    with open("model/keypoint_classifier/keypoint_classifier_label.csv", encoding="utf-8-sig") as f:
        keypoint_classifier_labels = csv.reader(f)
        keypoint_classifier_labels = [row[0] for row in keypoint_classifier_labels]

    # FPS Measurement
    cvFpsCalc = CvFpsCalc(buffer_len=10)

    # Set the initial target hand sign
    target_sign_id = keypoint_classifier_labels.index(target_sign)  # Find the index of the target sign

    # Main loop until the correct gesture is detected
    while True:
        fps = cvFpsCalc.get()

        # Process Key (ESC: end)
        key = cv.waitKey(10)
        if key == 27:  # ESC to quit
            break

        # Camera capture
        ret, image = cap.read()
        if not ret:
            break
        image = cv.flip(image, 1)  # Mirror display
        debug_image = copy.deepcopy(image)

        cv.putText(
            debug_image,
            f"Sign: {target_sign}",
            (10, 50),  # Position of the text
            cv.FONT_HERSHEY_SIMPLEX,
            1.0,
            (0, 0, 0),  # White color
            2,
            cv.LINE_AA,
        )

        # Detection implementation
        image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = hands.process(image)
        image.flags.writeable = True

        if results.multi_hand_landmarks is not None:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                # Bounding box calculation
                brect = calc_bounding_rect(debug_image, hand_landmarks)
                # Landmark calculation
                landmark_list = calc_landmark_list(debug_image, hand_landmarks)

                # Conversion to relative coordinates / normalized coordinates
                pre_processed_landmark_list = pre_process_landmark(landmark_list)

                # Hand sign classification
                hand_sign_id = keypoint_classifier(pre_processed_landmark_list)

                # Check if the correct sign is performed
                if hand_sign_id == target_sign_id:
                    cv.putText(
                        debug_image,
                        f"Correct Sign: {keypoint_classifier_labels[hand_sign_id]}",
                        (10, 100),
                        cv.FONT_HERSHEY_SIMPLEX,
                        1.0,
                        (0, 255, 0),  # Green color for success
                        2,
                        cv.LINE_AA,
                    )
                    break  # Exit the loop if the correct gesture is detected
                else:
                    cv.putText(
                        debug_image,
                        f"Incorrect, Try Again: {keypoint_classifier_labels[hand_sign_id]}",
                        (10, 100),
                        cv.FONT_HERSHEY_SIMPLEX,
                        1.0,
                        (0, 0, 255),  # Red color for incorrect
                        2,
                        cv.LINE_AA,
                    )

        # Show the updated frame with feedback
        cv.imshow("Hand Gesture Recognition", debug_image)

    cap.release()
    cv.destroyAllWindows()


def select_mode(key, mode):
    number = -1
    if 65 <= key <= 90:  # A ~ B
        number = key - 65
    if key == 110:  # n (Inference Mode)
        mode = 0
    if key == 107:  # k (Capturing Landmark From Camera Mode)
        mode = 1
    if key == 100:  # d (Capturing Landmarks From Provided Dataset Mode)
        mode = 2
    return number, mode


def calc_bounding_rect(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]

    landmark_array = np.empty((0, 2), int)

    for _, landmark in enumerate(landmarks.landmark):
        landmark_x = min(int(landmark.x * image_width), image_width - 1)
        landmark_y = min(int(landmark.y * image_height), image_height - 1)

        landmark_point = [np.array((landmark_x, landmark_y))]

        landmark_array = np.append(landmark_array, landmark_point, axis=0)

    x, y, w, h = cv.boundingRect(landmark_array)

    return [x, y, x + w, y + h]


def calc_landmark_list(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]

    landmark_point = []

    # Keypoint
    for _, landmark in enumerate(landmarks.landmark):
        landmark_x = min(int(landmark.x * image_width), image_width - 1)
        landmark_y = min(int(landmark.y * image_height), image_height - 1)
        # landmark_z = landmark.z

        landmark_point.append([landmark_x, landmark_y])

    return landmark_point


def pre_process_landmark(landmark_list):
    temp_landmark_list = copy.deepcopy(landmark_list)

    # Convert to relative coordinates
    base_x, base_y = 0, 0
    for index, landmark_point in enumerate(temp_landmark_list):
        if index == 0:
            base_x, base_y = landmark_point[0], landmark_point[1]

        temp_landmark_list[index][0] = temp_landmark_list[index][0] - base_x
        temp_landmark_list[index][1] = temp_landmark_list[index][1] - base_y

    # Convert to a one-dimensional list
    temp_landmark_list = list(itertools.chain.from_iterable(temp_landmark_list))

    # Normalization
    max_value = max(list(map(abs, temp_landmark_list)))

    def normalize_(n):
        return n / max_value

    temp_landmark_list = list(map(normalize_, temp_landmark_list))

    return temp_landmark_list


def logging_csv(number, mode, landmark_list):
    if mode == 0:
        pass
    if (mode == 1 or mode == 2) and (0 <= number <= 35):
        csv_path = "model/keypoint_classifier/keypoint.csv"
        with open(csv_path, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([number, *landmark_list])
    return


def draw_landmarks(image, landmark_point):
    if len(landmark_point) > 0:
        # Thumb
        cv.line(image, tuple(landmark_point[2]), tuple(landmark_point[3]), (0, 0, 0), 6)
        cv.line(
            image, tuple(landmark_point[2]), tuple(landmark_point[3]), (255, 255, 255), 2
        )  # Add this to close your loop
        cv.line(image, tuple(landmark_point[3]), tuple(landmark_point[4]), (0, 0, 0), 6)
        cv.line(
            image, tuple(landmark_point[3]), tuple(landmark_point[4]), (255, 255, 255), 2
        )


    # Key Points
    for index, landmark in enumerate(landmark_point):
        if index == 0:  # 手首1
            cv.circle(image, (landmark[0], landmark[1]), 5, (255, 255, 255), -1)
            cv.circle(image, (landmark[0], landmark[1]), 5, (0, 0, 0), 1)

    return image

if __name__ == "__main__":
    # Start Flask server in a separate thread
    flask_thread = threading.Thread(target=start_flask)
    flask_thread.start()

    # Run the main detector loop
    main()
