
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import pickle

# Initialize Flask app
app = Flask(__name__)
CORS(app)

word_model = tf.keras.models.load_model("word_model.h5")
letter_model = tf.keras.models.load_model("new_hand_model.h5")

# ✅ Load both label encoders
with open("label_encoder.pkl", "rb") as f:
    word_encoder = pickle.load(f)
labels = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")


# @app.route("/")
# def index():
#     return jsonify({"message": "ASL Word Server is running ✅"})

# @app.route("/predict", methods=["POST"])
# def predict():
#     data = request.get_json()
#     landmarks = data.get("landmarks")

#     if not landmarks or len(landmarks) != 42:
#         return jsonify({"error": "Invalid landmark data"}), 400

#     input_data = np.array(landmarks).reshape(1, -1)
#     prediction = model.predict(input_data)
#     predicted_class = np.argmax(prediction)
#     predicted_label = encoder.inverse_transform([predicted_class])[0]

#     return jsonify({"letter": predicted_label})

# if __name__ == "__main__":
#     app.run(port=5016, debug=True)



@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    landmarks = data.get("landmarks")
    mode = data.get("mode", "word")  # default = word model

    if not landmarks or len(landmarks) != 42:
        return jsonify({"error": "Invalid input"}), 400

    input_data = np.array(landmarks).reshape(1, -1)

    if mode == "letter":
        print("📨 Using LETTER model")
        prediction = letter_model.predict(input_data)
        label = labels[np.argmax(prediction)]

    else:
        print("📨 Using WORD model")
        prediction = word_model.predict(input_data)
        label = word_encoder.inverse_transform([np.argmax(prediction)])[0]
        
    print("Prediction:", label)
    return jsonify({"letter": label})

if __name__ == "__main__":
    app.run(port=5020, debug=True)