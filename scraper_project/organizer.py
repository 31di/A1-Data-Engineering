import os
import shutil
import pandas as pd

books =pd.read_csv("scraper_project/data/processed/cleaned_books.csv")

for i in range(1, 6):
    os.makedirs(f"scraper_project/images/{i}_star", exist_ok=True)


for _, row in books.iterrows():
    img_path = row["img"]
    if os.path.exists(img_path):
        shutil.copy(img_path, f"scraper_project/images/{row['rating']}_star")
    print(f"Copied {img_path} to images/{row['rating']}_star")
print ("All images have been organized into their respective rating folders.\n")

os.makedirs("scraper_project/data/organized_data", exist_ok=True)
for i in range(1, 6):
    os.makedirs(f"scraper_project/data/organized_data/{i}_star", exist_ok=True)
    
for rating, group in books.groupby("rating"):
    rating_folder = f"scraper_project/data/organized_data/{rating}_star"    
    group.to_csv(f"{rating_folder}/{rating}_star.csv", index=False)
    print(f"Saved {len(group)} books to {rating_folder}/{rating}_star.csv")
