import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load CSV
df = pd.read_csv("dataset/hello.csv", header=None)

# Split into X and y
X = df.iloc[:, 1:].values  # Landmark features
y = df.iloc[:, 0].values   # All should be "hello"

# Encode labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Build model
model = tf.keras.Sequential([
    tf.keras.layers.Input((42,)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1, activation='softmax')  # Output = 1 class
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train
model.fit(X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test))

# Save
model.save("hello_model.h5")
print("✅ Hello model trained and saved!")

