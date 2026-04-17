import pandas as pd
from store import load_data, store_clean_data

data = load_data()

raw_data = pd.DataFrame(data, index=range(len(data)))

raw_data[["review_count", "rating"]] = raw_data[["review_count", "rating"]].astype(int)

desc = raw_data["description"].fillna("")


# إذا كان عدد الفواصل (,) = 5
mask = desc.str.count(",") >= 5

raw_data.loc[mask, "name"] = desc.loc[mask].str.split(",", n=1).str[0].str.strip()
# raw_data[]

# بسبب انه في نمط لاحضته وهو انه الشاشه مكتوبه في الوصف جمبها علامه تنصيص فاعتبرتها زي العلامه
mask2 = raw_data["description"].str.contains('"')
raw_data["screen_size"] = (
    raw_data["description"]
    .loc[mask2]
    .str.extract(r'(\d{1,2}(?:\.\d{1,2})?)\s*"')[0]
    .astype(float)
)

raw_data["processor"] = raw_data["description"].str.extract(r",([^,]+),\s*\d+\s?GB")[0]

raw_data["hard"] = raw_data["description"].str.extract(r"\s*\d+\s?GB,([^,]+),")[0]

raw_data["ram"] = raw_data["description"].str.extract(r"(\d+)\s?GB")[0].astype(int)

raw_data["price"] = (
    raw_data["price"].astype("string").str.replace("$", "", regex=False).astype(float)
)
raw_data["name"] = raw_data["name"].astype("string").str.strip()
raw_data.dropna(inplace=True)

raw_data["id"] = raw_data.index + 1
# إعادة ترتيب الأعمدة
cols = ["id"] + [col for col in raw_data.columns if col != "id"]
raw_data = raw_data[cols]
# store_clean_data(raw_data)
store_clean_data(raw_data)
