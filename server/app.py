
import tensorflow as tf
from keras.layers import BatchNormalization


def mish(x):
    return x * tf.math.tanh(tf.math.softplus(x))

from flask import Flask, request, jsonify
from flask_cors import CORS 
import numpy as np

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model('keypoint_classifier.h5')
#model = tf.keras.models.load_model(
    #'keypoint_classifier.keras',
    #custom_objects={
       # 'mish': mish,
       # 'BatchNormalization': BatchNormalization
   # }
#)

# Labels for classes (assuming A-Z)
labels = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        landmarks = np.array(data['landmarks']).reshape(1, -1)  # Reshape input for model
        prediction = model.predict(landmarks)
        predicted_class = np.argmax(prediction)
        letter = labels[predicted_class]

        return jsonify({'letter': letter})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
