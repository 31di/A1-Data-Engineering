import numpy as np
import csv
import pickle


def load_data(file_path):
    try:
        reader = csv.reader(open(file_path, "r"))
        # Iterate over each row in the file
        data=np.array([], ndmin=2)
        reader.__next__()  # Skip the header row
        for row in reader:
            data = np.vstack([data, row]) if data.size else np.array([row])
        return data
    except Exception as e:
        print(f"An error occurred while loading the data: {e}")
        return None
        
def clean_text(text):
    import re

    text = str(text)
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)  # Remove punctuation
    text = re.sub(r"\d", "", text)  # Remove digits
    return text


def tokenize(text):
    tokens = text.split()
    return tokens


def create_bag_of_words(text):
    bag_of_words = []
    for line in text:
        words = tokenize(line)
        for word in words:
            if word not in bag_of_words:
                bag_of_words.append(word)
    return bag_of_words

    

def change_text_to_vector(data, bag_of_words):
    bag_of_words = np.array(bag_of_words)
    data = clean_text(data)
    data = tokenize(data)
    vector = np.zeros(len(bag_of_words), dtype=int)

    for i, word in enumerate(bag_of_words):
        if word in data:
            vector[i] = 1

    return vector



def calculate_cosine_similarity(articals_matrix):
    n = articals_matrix.shape[0]
    similarity_matrix = np.zeros((n, n))

    for i in range(n):
        for j in range(n):
            if i == j:
                similarity_matrix[i, j] = 1.0
            else:
                vector1 = articals_matrix[i]
                vector2 = articals_matrix[j]
                dot_product = np.dot(vector1, vector2)
                magnitude_vector1 = np.linalg.norm(vector1)
                magnitude_vector2 = np.linalg.norm(vector2)

                if magnitude_vector1 == 0 or magnitude_vector2 == 0:
                    similarity_matrix[i, j] = 0.0
                else:
                    cosine_similarity = dot_product / (magnitude_vector1 * magnitude_vector2)
                    similarity_matrix[i, j] = cosine_similarity

    return similarity_matrix

def save_similarity_matrix(similarity_matrix):
    try:
        with open("similarities.pkl", "wb") as file:
            pickle.dump(similarity_matrix, file)
        print("Similarity matrix saved to similarities.pkl")
    except Exception as e:
        print(f"An error occurred while saving the similarity matrix: {e}")

def load_similarity_matrix():
    try:
        with open("similarities.pkl", "rb") as file:
            similarity_matrix = pickle.load(file)
        print("Similarity matrix loaded from similarities.pkl")
        return similarity_matrix
    except Exception as e:
        print(f"An error occurred while loading the similarity matrix: {e}")
        return None
    
def get_top_k_similar_articles(similarity_matrix, article_index, k):
    if article_index < 0 or article_index >= similarity_matrix.shape[0]:
        print(f"Invalid article index: {article_index}")
        return []

    similarities = similarity_matrix[article_index]
    top_k_indices = np.argsort(similarities)[::-1][1:k+1]  # Exclude the article itself
    return top_k_indices.tolist()