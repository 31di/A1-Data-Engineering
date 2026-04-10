# processor.py
import pandas as pd
import os

# إنشاء مجلد لحفظ البيانات المعالجة إذا لم يكن موجود
os.makedirs("scraper_project/data/processed", exist_ok=True)

# قراءة ملف CSV الخام
df = pd.read_csv("scraper_project/data/raw/raw_books.csv")

# إزالة التكرارات
df = df.drop_duplicates()

# تنظيف عمود السعر وتحويله إلى أرقام (قد يحتوي على رموز عملة أو نص)
df["price"] = pd.to_numeric(
    df["price"].astype(str).str.replace(r"[^0-9.]", "", regex=True),
    errors="coerce",
)

# ملء القيم المفقودة في العمود price بمتوسط السعر

price_mean = df["price"].mean(skipna=True)
if pd.notna(price_mean):
    df["price"] = df["price"].fillna(price_mean)
rater_mapping = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}
df['rating']= df['rating'].map(rater_mapping).astype(int)
# عمل ملخص: تجميع البيانات حسب rating وحساب عدد الكتب ومتوسط السعر
summary = df.groupby("rating")["price"].agg(["count", "mean"])
# حفظ البيانات النظيفة في ملف جديد
df.to_csv("scraper_project/data/processed/cleaned_books.csv", index=False)

# حفظ الملخص في ملف جديد
summary.to_csv("scraper_project/data/processed/summary.csv")

print("Processing Done!")
