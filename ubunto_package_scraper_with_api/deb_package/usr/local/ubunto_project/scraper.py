from bs4 import BeautifulSoup
import requests
from store import store_raw_data


base_url = "https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops"


response = requests.get(base_url)
response.raise_for_status()

soup = BeautifulSoup(response.text, "html.parser")
data=[]
products = soup.select("div.product-wrapper.card-body")
if products:
    print("start to scrap")
else:
    print("No products found.")

for product in products:
    title_tag = product.select_one("a.title")
    name = title_tag.get_text() if title_tag else None

    price_tag = product.select_one("h4.price span[itemprop='price']")
    price = price_tag.get_text() if price_tag else None

    desc_tag = product.select_one("p.description")
    description = desc_tag.get_text() if desc_tag else None

    review_tag = product.select_one("p.review-count span[itemprop='reviewCount']")
    review_count = review_tag.get_text( ) if review_tag else None

    rating_tag = product.select_one("div.ratings p[data-rating]")
    rating = rating_tag.get("data-rating") if rating_tag else None

    data.append(
        {"name": name, "price": price, "description": description, "review_count": review_count, "rating": rating}
    )
        
        
print(f"scrap {len(products)} from {base_url} ")
store_raw_data(data)