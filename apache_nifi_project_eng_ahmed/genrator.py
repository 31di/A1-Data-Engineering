import json
import time
import random
import os
from datetime import datetime

# Folder where files will be saved so NiFi can pick them up
OUTPUT_DIR = "lab_data"

# Create the folder if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Possible transaction statuses
statuses = ["COMPLETED", "PENDING", "FAILED", "REFUNDED"]


def generate_record():
    """Generate a single pseudo-random transaction record as a dictionary."""
    current_dt = datetime.now()

    # Create the ID in the required pattern: Transaction_{datetime}
    dt_string = current_dt.strftime("%Y%m%d%H%M%S%f")
    transaction_id = f"Transaction_{dt_string}"

    customer_id = random.randint(1000, 9999)
    amount = round(random.uniform(10.0, 500.0), 2)
    status = random.choice(statuses)
    date_str = current_dt.strftime("%Y-%m-%d %H:%M:%S")

    # Introduce some data "messiness"
    messy_chance = random.random()

    if messy_chance < 0.05:
        amount = None  # Simulate a missing value (appears as null in JSON)
    elif messy_chance < 0.10:
        status = status.lower()  # Inconsistent casing
    elif messy_chance > 0.90:
        date_str = current_dt.strftime("%d/%m/%Y")  # Different date format

    # Return as an object to be serialized to JSON
    return {
        "Transaction_ID": transaction_id,
        "Customer_ID": customer_id,
        "Amount": amount,
        "Status": status,
        "Date": date_str,
    }


def simulate_data():
    """Continuously generate data and save it to JSON files."""
    print(f"Starting data simulation. Writing JSON files to folder '{OUTPUT_DIR}'...")
    print("Press Ctrl+C to stop the script.")

    try:
        while True:
            # Generate a random number of records per file
            batch_size = random.randint(5, 15)
            records = [generate_record() for _ in range(batch_size)]

            # Simulate duplicates with a 20% chance
            if random.random() < 0.2:
                records.append(records[0])

            # Name the file using the required pattern with a .json extension
            file_dt = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = os.path.join(OUTPUT_DIR, f"Transaction_{file_dt}.json")

            # Write the data to a JSON file
            with open(filename, mode="w", encoding="utf-8") as file:
                # Use json.dump to write nicely formatted JSON (indent=4)
                json.dump(records, file, indent=4, ensure_ascii=False)

            print(f"Created file: {filename} (contains {len(records)} records)")

            # Wait 5 seconds before generating the next file
            time.sleep(5)

    except KeyboardInterrupt:
        print("\nData simulation stopped.")


if __name__ == "__main__":
    simulate_data()
