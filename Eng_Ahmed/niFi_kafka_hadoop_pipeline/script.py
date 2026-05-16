import csv
import random
import time
import datetime
import os

# مجلد الإخراج
OUTPUT_DIR = "lab_data/input"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# إعدادات
RECORDS_PER_FILE = random.randint(6300, 10000)   # عدد مبدئي للسجلات
STREAM_DELAY = 0.0001
MIN_FILE_SIZE = 200 * 1024   # 200KB بالبايت

# بيانات افتراضية للبنك
customers = ["ACC"+''.join(random.choices("0123456789", k=3)) for _ in range(10)]
transaction_types = ["DEPOSIT", "WITHDRAWAL", "TRANSFER", "PAYMENT", "INVALID"]
currencies = ["USD", "SAR", "YER", None]
timestamp_formats = [
    "%Y-%m-%d %H:%M:%S",
    "%d/%m/%Y %H:%M",
    "%m-%d-%Y %I:%M%p"
]

def generate_record():
    # صيغة موحدة RFC 3339 (ISO 8601)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")

    record = {
        "account_id": random.choice(customers),
        "transaction_type": random.choice(transaction_types),
        "amount": random.choice([100, 250, 500, 1000, -200, None]),
        "currency": random.choice(currencies),
        "timestamp": timestamp
    }
    return record


def stream_data():
    file_count = 0
    record_count = 0
    writer = None
    csvfile = None
    filename = None

    while True:
        # إذا بدأنا ملف جديد
        if record_count == 0:
            file_count += 1
            filename = f"{OUTPUT_DIR}/banking_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{file_count}.csv"
            csvfile = open(filename, "w", newline="")
            fieldnames = ["account_id", "transaction_type", "amount", "currency", "timestamp"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            print(f"Started new file: {filename}")

        record = generate_record()

        # احتمال تكرار السجل
        if random.random() < 0.2:
            writer.writerow(record)
            writer.writerow(record)
        else:
            writer.writerow(record)

        csvfile.flush()
        print(record)

        record_count += 1
        time.sleep(STREAM_DELAY)

        # إذا وصلنا الحد المبدئي للسجلات → افحص حجم الملف
        if record_count >= RECORDS_PER_FILE:
            csvfile.flush()
            size = os.path.getsize(filename)
            if size >= MIN_FILE_SIZE:
                csvfile.close()
                record_count = 0
                print(f"Closed file {filename} with size {size/1024:.2f} KB")
            else:
                # إذا الحجم أقل من 200KB → استمر في توليد سجلات إضافية
                print(f"File {filename} size {size/1024:.2f} KB < 200KB, adding more records...")

if __name__ == "__main__":
    stream_data()
