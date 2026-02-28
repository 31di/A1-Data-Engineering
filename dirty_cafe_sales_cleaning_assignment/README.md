# Cafe Sales Data Cleaning

## About

This project cleans a dirty cafe sales dataset. The original data has missing values and invalid entries (ERROR, UNKNOWN).

## What I Did

### 1. Column Renaming

Removed spaces from column names for easier coding.

### 2. Removed Duplicates

Dropped duplicate rows to avoid counting transactions twice.

### 3. Cleaned Payment Method & Location

- Replaced ERROR/UNKNOWN with "Unknown"
- Kept rows because other data is still useful

### 4. Fixed Price Per Unit

- Used item-price mapping to fill missing prices
- Each item has a fixed price (Coffee=$2, Sandwich=$4, etc.)

### 5. Fixed Item Names

- Guessed item from price when Item was missing
- For prices with multiple items, picked the most popular one

### 6. Fixed Quantity & Total Spent

- Used formula: Total Spent = Quantity × Price
- Calculated missing values from the other two columns

### 7. Cleaned Transaction Date

- Dropped rows with missing dates (can't guess dates)
- Converted to datetime type

### 8. Added Season Feature

Created a Season column based on the month for seasonal analysis.

## Files

- `dirty_cafe_sales.csv` - Original dirty data
- `cleaned_cafe_sales.csv` - Cleaned data ready for analysis
- `main.ipynb` - Jupyter notebook with all cleaning steps
