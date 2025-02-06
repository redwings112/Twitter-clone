import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Load the trained model (assume it's trained already)
model = joblib.load("foul_language_model.pkl")  # Pre-trained model file
vectorizer = joblib.load("vectorizer.pkl")  # Pre-trained vectorizer

def detect_foul_language(text):
    """ Detect foul language in the given text """
    vectorized_text = vectorizer.transform([text])
    prediction = model.predict(vectorized_text)
    return prediction[0]  # Returns 1 if foul language detected, else 0
