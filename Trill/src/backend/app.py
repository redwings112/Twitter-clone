from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import os
import numpy as np

app = Flask(__name__)
CORS(app)

# Load pre-trained model and vectorizer
with open('foul_language_model.pkl', 'rb') as model_file:
    foul_language_model = pickle.load(model_file)

with open('vectorizer.pkl', 'rb') as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

# List to store posts
posts = []

# Ensure uploads directory exists
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def detect_foul_language(text):
    """Use the model and vectorizer to detect foul language."""
    text_vector = vectorizer.transform([text])  # Transform the text into a vector
    prediction = foul_language_model.predict(text_vector)  # Predict using the model
    return bool(prediction[0])  # Return True if foul language is detected


@app.route('/posts', methods=['POST'])
def add_post():
    try:
        user = request.form.get('user', 'Anonymous')
        avatar = request.form.get('avatar', 'https://via.placeholder.com/50')
        text = request.form.get('text')
        image = request.files.get('image')
        timestamp = request.form.get('timestamp')

        # Validate required fields
        if not text:
            return jsonify({"error": "Text is required"}), 400

        # Detect foul language
        if detect_foul_language(text):
            return jsonify({"error": "Foul language detected! Post not allowed."}), 400

        # Save image (if provided)
        image_url = None
        if image:
            image_path = os.path.join(UPLOAD_FOLDER, image.filename)
            image.save(image_path)
            image_url = f"/uploads/{image.filename}"

        # Create post
        post = {
            "id": len(posts) + 1,
            "user": user,
            "avatar": avatar,
            "text": text,
            "image": image_url,
            "timestamp": timestamp,
            "likes": 0,
            "comments": []
        }
        posts.append(post)
        return jsonify(post), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Failed to add post. Reason: {str(e)}"}), 500

@app.route('/posts', methods=['GET'])
def get_posts():
    return jsonify(posts)


@app.route('/uploads/<filename>', methods=['GET'])
def get_image(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "File not found"}), 404


if __name__ == '__main__':
    app.run(port=5005, debug=True)
