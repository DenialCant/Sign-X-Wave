import os
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle

print("🚀 Training started...")

# Load CSVs
data_dir = "dataset"
csv_files = ["hello.csv", "my.csv", "name.csv"]
dataframes = []

for file in csv_files:
    path = os.path.join(data_dir, file)
    if not os.path.exists(path):
        print(f"❌ File missing: {path}")
        exit()
    df = pd.read_csv(path, header=None)
    dataframes.append(df)

df = pd.concat(dataframes)
df.columns = [0] + list(range(1, 43))  # label + 42 landmarks

X = df.iloc[:, 1:].values
y = df.iloc[:, 0].values

# Encode labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)
with open("label_encoder.pkl", "wb") as f:
    pickle.dump(encoder, f)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Build model
model = tf.keras.Sequential([
    tf.keras.layers.Input((42,)),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(len(np.unique(y_encoded)), activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=60, batch_size=16, validation_data=(X_test, y_test))

model.save("word_model.h5")
print("✅ Model trained and saved as word_model.h5")
