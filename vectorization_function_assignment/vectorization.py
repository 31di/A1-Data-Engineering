import numpy as np


def change_text_to_vector(text, bag_of_words):
    tokenized_text = tokenize(text)
    bag_of_words=np.array(bag_of_words)
    text=np.array(tokenized_text)
    vector=np.array([],dtype=int)

    for word in bag_of_words:
        if word in text:
            vector=np.append(vector, 1)
        else:
            vector=np.append(vector, 0)
    return vector


def tokenize(text):
    for i in range(len(text)):
        text[i] = text[i].lower()
    text = text[0].split()
    return text