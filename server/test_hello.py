import os
import pandas as pd
import numpy as np
import tensorflow as tf

print("✅ Starting hello model test...")

# Confirm model file exists
if not os.path.exists("hello_model.h5"):
    print("❌ ERROR: hello_model.h5 not found.")
    exit()

# Confirm CSV exists
if not os.path.exists("dataset/hello.csv"):
    print("❌ ERROR: hello.csv not found.")
    exit()

print("📁 Loading model...")
model = tf.keras.models.load_model("hello_model.h5")

print("📁 Loading hello.csv...")
df = pd.read_csv("dataset/hello.csv", header=None)
print("✅ CSV loaded:", df.shape)

if df.shape[0] == 0:
    print("❌ ERROR: hello.csv is empty.")
    exit()

X = df.iloc[:, 1:].values  # Only the landmark data

print("🔍 Running predictions:")
for i in range(min(5, len(X))):
    sample = X[i].reshape(1, -1)
    prediction = model.predict(sample)
    print(f"Sample {i + 1} Prediction:", prediction[0][0])
