
# Article Similarity 

This assignment calculates how similar each article is to the others.

## What it does

- Load articles from `articles.csv`
- Clean the text (lowercase, remove punctuation and numbers)
- Convert each article to a vector (Bag of Words)
- Compute **Cosine Similarity** between every pair of articles 
- Save the result as a square matrix in `similarities.pkl` 

## Output

- `similarities.pkl`: a similarity matrix of shape `(n_articles, n_articles)`

## How to run

Open `main.ipynb` and run the cells from top to bottom.

## utils.py functions (brief)

- `load_data(file_path)`: Reads the CSV file and returns the data as a NumPy array (skips the header).
- `clean_text(text)`: Converts text to lowercase and removes punctuation and digits.
- `tokenize(text)`: Splits text into a list of words (tokens) using spaces.
- `create_bag_of_words(text_list)`: Creates a vocabulary list of unique words from a list of cleaned texts.
- `change_text_to_vector(text, bag_of_words)`: Converts one text into a 0/1 vector based on the bag-of-words vocabulary.
- `calculate_cosine_similarity(articles_matrix)`: Computes cosine similarity between every pair of vectors using `numpy.dot` and `numpy.linalg.norm` and returns a square similarity matrix.
- `save_similarity_matrix(similarity_matrix)`: Saves the similarity matrix into `similarities.pkl` using `pickle`.
- `load_similarity_matrix()`: Loads and returns the similarity matrix from `similarities.pkl`.
- `get_top_k_similar_articles(similarity_matrix, article_index, k)`: Returns the indices of the top `k` most similar articles to the chosen article (excluding itself).

