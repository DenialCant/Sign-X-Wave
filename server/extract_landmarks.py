import cv2
import os
import pandas as pd
import mediapipe as mp
import numpy as np


# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.7)

# Path to your extracted Kaggle dataset
dataset_path = "./asl_alphabet_train"  # <-- Change this to your dataset folder
output_csv = "asl_landmarks_dataset.csv"
print("Checking if dataset path exists:", os.path.exists(dataset_path))
print("Folders inside dataset path:", os.listdir(dataset_path))

# List to store collected data
all_data = []

# Loop through each letter folder
for label in sorted(os.listdir(dataset_path)):
    letter_folder = os.path.join(dataset_path, label)
    if not os.path.isdir(letter_folder):
        continue

    print(f"Processing letter: {label}")

    for filename in os.listdir(letter_folder):
        img_path = os.path.join(letter_folder, filename)
        
        image = cv2.imread(img_path)
        if image is None:
            continue

        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)

        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]
            flat_landmarks = []

            for lm in hand_landmarks.landmark:
                flat_landmarks.append(lm.x)
                flat_landmarks.append(lm.y)

            if len(flat_landmarks) == 42:
                row = [label] + flat_landmarks
                all_data.append(row)

hands.close()

# Save to CSV
df = pd.DataFrame(all_data)
df.to_csv(output_csv, header=False, index=False)

print(f"✅ Done! Saved {len(all_data)} samples to {output_csv}")
