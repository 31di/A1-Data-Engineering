# Scraper Project (Books to Scrape)

A small data pipeline that scrapes book listings from **https://books.toscrape.com**, saves the raw dataset to CSV, cleans/transforms the data, and then organizes downloaded images and CSVs by book rating.

## What it does

1. **Scrape** (scraper.py)
   - Fetches the catalogue page(s) from *books.toscrape.com*
   - Extracts: `title`, `price`, `rating` (as words), `img_url`
   - Downloads each book image into `scraper_project/images/raw_images/`
   - Writes the raw dataset to: `scraper_project/data/raw/raw_books.csv`

2. **Process / Clean** (processor.py)
   - Loads `raw_books.csv`
   - Drops duplicates
   - Cleans `price` (removes currency symbols/text and converts to numeric)
   - Fills missing `price` values with the column mean (if a mean exists)
   - Converts `rating` from words to numbers (`One..Five` → `1..5`)
   - Saves:
     - Cleaned dataset: `scraper_project/data/processed/cleaned_books.csv`
     - Summary by rating (count + mean price): `scraper_project/data/processed/summary.csv`

3. **Organize outputs** (organizer.py)
   - Copies images into rating folders:
     - `scraper_project/images/1_star/` … `scraper_project/images/5_star/`
   - Splits the cleaned CSV into per-rating CSV files:
     - `scraper_project/data/organized_data/1_star/1_star.csv` …

4. **Run all steps** (main.py)
   - Runs `scraper.py` → `processor.py` → `organizer.py` in order.

## Requirements

- Python 3.9+ (recommended)
- Internet connection (for scraping)

Python packages:
- `requests`
- `beautifulsoup4`
- `pandas`

## Setup

From the repository root (the folder that contains `scraper_project/`):

```powershell
# Create & activate a virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r scraper_project\req.txt
```

## How to run

### Run the full pipeline

```powershell
python scraper_project\main.py
```

### Or run each step manually

```powershell
python scraper_project\scraper.py
python scraper_project\processor.py
python scraper_project\organizer.py
```

## Output files & folders

After a successful run you should see:

- Raw CSV: `scraper_project/data/raw/raw_books.csv`
- Cleaned CSV: `scraper_project/data/processed/cleaned_books.csv`
- Summary: `scraper_project/data/processed/summary.csv`
- Raw images: `scraper_project/images/raw_images/`
- Organized images: `scraper_project/images/1_star/` … `scraper_project/images/5_star/`
- Per-rating CSVs: `scraper_project/data/organized_data/<n>_star/<n>_star.csv`

## Notes / common issues

- If you see file-path errors, make sure you run commands **from the repo root**.
- `scraper.py` currently scrapes only the first page because of this condition:
  - `while current_page <= 1:`
  Increase the number to scrape more pages.
