from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin
from pathlib import Path
import re
import pandas as pd
import os
raw_books = []
current_page = 1

RAW_IMAGES_DIR = (Path(__file__).resolve().parent / "images" / "raw_images")
RAW_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

while current_page <= 50:
    url = f"https://books.toscrape.com/catalogue/page-{current_page}.html"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    books = soup.find_all(
        "article", class_="product_pod"
    )  # here we get all the book articles, we can also use the below code to find the same result

    for book in books:
        title = book.h3.a["title"]  # here we get the title of the book
        price = book.find("p", class_="price_color").text
        rating = book.p["class"][1]  # here we get the rating of the book
        img_src = book.find("img")["src"]  # here we get the image source of the book
        img_url = urljoin(url, img_src)  # here we replace the relative path of the image with the absolute path
        safe_title = re.sub(r"[<>:\\/*?\"|]", " ", title).strip()
        filename = f"{safe_title[:50].replace(':', ' ')}.png" if safe_title else "book.png"
        img_file_path = RAW_IMAGES_DIR / filename
        with open(img_file_path, "wb") as img_file:
            img_file.write(
                requests.get(img_url).content
            )  # here we download the image of the book
        print(
            {
                "title": title,
                "price": price,
                "rating": rating,
                "img_url": img_url,
                "img_file_path": str(img_file_path),
            }
        )
        print("-----------------------------")
        raw_books.append(
            {
                "title": title,
                "price": price,
                "rating": rating,
                "img_url": img_url,
                "img": str(img_file_path),
            }
        )
    next_btn = soup.find("li", class_="next")
    if next_btn:
        current_page += 1
    else:
        print ("No more pages to scrape.")
        break

if os.makedirs("scraper_project/data/raw", exist_ok=True):
    print("Directory created successfully or already exists.")

df = pd.DataFrame(raw_books)
df.to_csv("scraper_project/data/raw/raw_books.csv", index=False)
# print(raw_books)
 