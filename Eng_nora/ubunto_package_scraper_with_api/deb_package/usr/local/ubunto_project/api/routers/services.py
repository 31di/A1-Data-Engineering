import json


def load_data():
    # Load the cleaned data from the JSON file
    with open("data/clean/laptops_cleand_data.json", "r") as f:
        data = json.load(f)
    return data


def get_all_laptops():
    data = load_data()
    return data


def get_laptop_by_id(id: int):
    data = load_data()
    for laptop in data:
        if laptop["id"] == id:
            return laptop
    return None


def get_laptops_by_name(name: str):
    data = load_data()
    query = (name or "").strip().casefold()
    if not query:
        return []

    return [
        laptop for laptop in data if query in str(laptop.get("name", "")).casefold()
    ]
