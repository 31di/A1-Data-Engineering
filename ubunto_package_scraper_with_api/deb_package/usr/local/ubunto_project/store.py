import json
import os
def store_raw_data(data):
    os.makedirs("data/raw", exist_ok=True)
    with open("data/raw/laptops_raw_data.json", "w") as f:
        json.dump(data, f, indent=4)

def load_data():
    with open("data/raw/laptops_raw_data.json", "r") as f:
        data = json.load(f)
    return data

def store_clean_data(data):
    os.makedirs("data/clean", exist_ok=True)
    data.to_json("data/clean/laptops_cleand_data.json", orient="records", indent=4)
