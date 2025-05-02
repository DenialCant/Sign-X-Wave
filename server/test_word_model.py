import pandas as pd
import numpy as np
import tensorflow as tf
import pickle

# Load trained model
model = tf.keras.models.load_model("word_model.h5")

# Load label encoder
with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

# Load one sample from "name.csv"
sample = pd.read_csv("dataset/name.csv", header=None).iloc[0, 1:].astype('float32').values

# Predict
prediction = model.predict(np.array(sample).reshape(1, -1))
predicted_class = np.argmax(prediction)
label = encoder.inverse_transform([predicted_class])[0]

print("Raw prediction probabilities:", prediction)
print("✅ Predicted:", label)
