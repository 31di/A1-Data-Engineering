# Olist Data Warehouse Design and Modeling

## 1. Data Warehouse Design

### Architecture Choice

I decided to use the **Kimball dimensional modeling approach (Star Schema)**. This method organizes data into fact tables and dimension tables. It is easy to understand, simple to query, and works well for reporting and analytics.

### Modeling Approach

- I separated each main business process into its own **fact table**.  
- Around each fact table, I built **dimension tables** that describe customers, products, sellers, dates, and other important entities.  
- For key dimensions like Customer, Product, and Seller, I added **Slowly Changing Dimension (SCD Type 2)** logic. This allows me to keep track of changes over time (for example, if a customer moves to a new city, I can still see their old history).  

### Table Structures

- **Fact Tables:**  
  - `FactOrder` → one row per order, capturing the full lifecycle of the order.  
  - `FactSales` → one row per product sold inside an order.  
  - `FactReviews` → one row per customer review.  
  - `FactLeads` → one row per lead in the sales pipeline.  

- **Dimension Tables:**  
  - `DimCustomer`, `DimSeller`, `DimProduct`, `DimDate`, `DimTime`, `DimLead`, `DimBusinessSegment`.

### Justification

I chose this design because it gives me the right balance of **performance, clarity, and flexibility**:

- **Performance:** Queries on `FactOrder` are fast because each row represents a whole order. This makes it easy to answer questions like “How are sales trending over time?” without scanning millions of product rows.  
- **Clarity:** Each fact table represents one clear business process. This makes the model easier to understand and reduces confusion. Analysts know exactly where to look for data about orders, reviews, or leads.  
- **Flexibility:** By keeping `FactSales` at the product level, I can still drill down into detailed analysis (for example, “Which products drive the most revenue?”). This means I can support both high‑level reporting and detailed product analysis.  
- **Historical Accuracy:** With SCD Type 2 in dimensions, I can see how things changed over time. For example, if a seller moved from one city to another, I can still report correctly on past sales in the old location.  
- **Business Alignment:** This design directly supports the key business questions: sales trends, customer value, delivery performance, product revenue, customer satisfaction, and lead conversion.  

**Performance‑driven decision:** To improve query speed, I merged delivery performance into `FactOrder`. This way, each row represents a single order and includes the full lifecycle (purchase, approval, shipping, delivery). I linked it to Customer, Seller, Product, and Date dimensions. This design makes queries shorter and results faster because calculations happen at the order level. Meanwhile, `FactSales` remains at the product level, which requires longer calculations but provides detailed answers about product‑specific revenue and trends. This balance ensures I can answer both strategic questions quickly and detailed product questions accurately.

---

## 2. Data Modeling

### Business Processes

I identified four main processes in the dataset:

1. **Order Lifecycle** → captured in `FactOrder`.  
2. **Sales Transactions** → captured in `FactSales`.  
3. **Customer Reviews** → captured in `FactReviews`.  
4. **Lead Management** → captured in `FactLeads`.  

Each process is modeled as a separate fact table.

### Facts and Dimensions

- **Facts:** contain numeric measures such as payment value, freight cost, delivery duration, review score, and declared revenue.  
- **Dimensions:** contain descriptive attributes such as customer details, product specifications, seller information, dates, and geolocation.

### Granularity

- `FactOrder`: one row per order.  
- `FactSales`: one row per product inside an order.  
- `FactReviews`: one row per review.  
- `FactLeads`: one row per lead.  

### Data Quality

- I used **surrogate keys** in dimensions to avoid problems with natural keys.  
- I added **SCD Type 2** to important dimensions to preserve history.  
- I separated categories and geolocation into their own dimensions to reduce duplication and improve consistency.  

---

## Business Matrix

| Business Question                             | Fact Table       | Dimensions Used                                  |
|-----------------------------------------------|------------------|--------------------------------------------------|
| How are sales trending over time?             | FactOrder        | dim_date, dim_customer                           |
| Who are the most valuable customers?          | FactOrder        | dim_customer, dim_date                           |
| Which products generate the most revenue?     | FactOrderItems   | dim_product, dim_date                            |
| How efficient is order fulfillment?           | FactOrder        | dim_date, dim_customer                           |
| What affects delivery performance?            | FactOrder        | dim_date                                         |
| How satisfied are customers with sellers?     | FactOrderReviews | dim_customer, dim_seller, dim_product, dim_date  |
| Which product categories have quality issues? | FactOrderReviews | dim_product, dim_category, dim_date              |

---

## Conclusion

This design balances performance, clarity, and flexibility.  

- `FactOrder` gives fast answers at the order level.  
- `FactSales` provides detailed product‑level analysis.  
- SCD Type 2 dimensions preserve history for customers and sellers.  
- The performance decision ensures queries are optimized while still supporting detailed analysis when needed.

---

## 3. Data Pipeline (ETL)

This ETL is implemented for the most important and most complex fact table (`FactOrder`), together with the key dimensions needed to show the idea clearly (`DimProduct`, `DimCustomer`, `DimSeller`). and The ( `DimDate`, `DimTime`) not in ETL but I build it with sql query.For The remaining fact tables and dimensions will be completed later.

### Source and Target

- **Source:** SQLite database (Olist)
- **Target:** PostgreSQL database (DWH)

### Steps (in order)

1. **Extract (SQLite)**
   - Read `products`, `customers`, `sellers`.
   - Read orders at *order level* by aggregating:
     - `total_payment` from `order_payments`
     - `total_items` and `total_sellers` from `order_items`

2. **Transform**
   - **DimProduct (products)**
     - Keep only the needed columns:
       - `product_id`, `product_category_name`, and the 4 numeric size/weight columns.
     - Handle missing category:
       - Fill missing `product_category_name` with `"Unknown"`.
     - Handle missing numeric values:
       - For `product_weight_g`, `product_length_cm`, `product_height_cm`, `product_width_cm`:
       - Fill missing values using the column mean.
     - Note:
       - This is a simple, easy-to-explain rule. It keeps the pipeline stable, but it is not the most accurate for all business cases.

   - **DimCustomer (customers)**
     - Keep only the needed columns:
       - `customer_id`, `customer_unique_id`, `customer_city`, `customer_state`.
     - In the current implementation, customers are loaded mostly “as-is” (no heavy cleaning rules yet).

   - **DimSeller (sellers)**
     - Keep only the needed columns:
       - `seller_id`, `seller_city`, `seller_state`.
     - In the current implementation, sellers are loaded mostly “as-is” (no heavy cleaning rules yet).

   - **FactOrder preparation**
     - Parse timestamp columns to datetime.
     - If an order is marked as `delivered` but important delivery dates are missing, it is dropped to avoid wrong delivery KPIs.
     - Create date/time keys (integers like `YYYYMMDD` and `HHMMSS`) from timestamps.
     - Create delivery KPIs:
       - `delivery_duration` (delivered date - purchase date)
       - `is_late_delivery` (delivered date > estimated date)
   - **Key mapping**
     - Load `customer_key` from `DimCustomer` and merge it into `FactOrder`.
   - **Final shape**
     - Keep only the final columns needed for `factorder`.
     - Drop duplicate `order_id`.

3. **Load (PostgreSQL)**
   - Append to `dimproduct`, `dimcustomer`, `dimseller`, then append to `factorder`.

---

## 5. Performance Optimization

To keep the warehouse fast and responsive, I considered these performance strategies:

- **Indexing (for faster joins and filters)**
  - In the current PostgreSQL schema, the main ID columns already have **primary key / unique indexes** (for example on `order_id`, `product_id`, `customer_id`, `seller_id`). This helps a lot for lookups and integrity.
  - For analytics queries, it is also very useful to add indexes on the columns that are used for **joining and filtering** in the fact table (example: `factorder.customer_key`, `factorder.date_purchase_key`). This can reduce query time significantly.

- **Surrogate keys (smaller indexes, faster comparisons)**
  - Instead of joining facts using long text IDs, the model uses numeric surrogate keys where available (example: `customer_key`).
  - Numeric keys make indexes smaller and comparisons faster inside the database engine.

  ---

  ## 6. Reporting Layer

  The goal is to let business users answer key questions directly from the DWH with simple, consistent queries. Because we use a **Star Schema**, reporting is straightforward: measures live in **Fact** tables and descriptive attributes live in **Dimension** tables.

  ### How the DWH answers the business questions

  #### 1) How are sales trending over time?

  - Use `factorder.total_payment` as the sales metric.
  - Join `factorder.date_purchase_key` to `dimdate.date_key` to group by day/month/year.

  Example (PostgreSQL):

  ```sql
  SELECT d.year, d.month,
         SUM(f.total_payment) AS sales
  FROM factorder f
  JOIN dimdate d ON d.date_key = f.date_purchase_key
  GROUP BY d.year, d.month
  ORDER BY d.year, d.month;
  ```

  #### 2) Who are the most valuable customers?

  - Aggregate `total_payment` per customer using `customer_key`.
  - Join `factorder.customer_key` to `dimcustomer.customer_key` to show customer attributes (city/state).

  Example:

  ```sql
  SELECT c.customer_unique_id,
         SUM(f.total_payment) AS lifetime_value,
         COUNT(*) AS orders_count
  FROM factorder f
  JOIN dimcustomer c ON c.customer_key = f.customer_key
  GROUP BY c.customer_unique_id
  ORDER BY lifetime_value DESC
  LIMIT 10;
  ```

  #### 3) What affects delivery performance?

  - Delivery KPIs are already prepared inside `factorder`, such as:
    - `delivery_duration`
    - `is_late_delivery`
  - You can compare performance by geography (customer/seller city/state) or by time (DimDate).

  Example (late delivery rate by customer state):

  ```sql
  SELECT c.customer_state,
         AVG(CASE WHEN f.is_late_delivery THEN 1 ELSE 0 END) AS late_rate,
         AVG(f.delivery_duration) AS avg_delivery_days
  FROM factorder f
  JOIN dimcustomer c ON c.customer_key = f.customer_key
  GROUP BY c.customer_state
  ORDER BY late_rate DESC;
  ```

  #### 4) Which products/categories drive revenue?

  - This requires a **product-level fact** (e.g., `factsales` / order-items grain), because `factorder` is currently at the order level and does not contain product/category details.
  - Once `factsales` is available, it will join to `dimproduct` (and `dimdate`) to aggregate revenue by product/category.

  Expected example after adding `factsales`:

  ```sql
  SELECT p.product_category_name,
         SUM(s.payment_value) AS revenue
  FROM factsales s
  JOIN dimproduct p ON p.product_key = s.product_key
  JOIN dimdate d ON d.date_key = s.date_key
  GROUP BY p.product_category_name
  ORDER BY revenue DESC;
  ```

  ---

  ## 7. How to Run the Project (ETL)

  ### Prerequisites

  - Python 3.9+
  - PostgreSQL running locally (or reachable remotely)
  - The Olist SQLite database file (e.g., `olist.sqlite`)

  ### Step 1) Create/activate a virtual environment

  From the project folder:

  ```bash
  python -m venv venv
  ```

  Windows PowerShell:

  ```powershell
  venv\Scripts\Activate.ps1
  ```

  ### Step 2) Install dependencies

  ```bash
  pip install -r requirements.txt
  ```

  ### Step 3) Configure database connections

  The connections are defined in `config/settings.py` and can be overridden using environment variables:

  - `SQLITE_PATH` = full path to your `olist.sqlite`
  - `PG_URI` = PostgreSQL connection string

  Windows PowerShell example:

  ```powershell
  $env:SQLITE_PATH = "C:\\path\\to\\olist.sqlite"
  $env:PG_URI = "postgresql://postgres:admin@localhost:5432/new-DWH"
  ```

  ### Step 4) Create the DWH schema in PostgreSQL

  Run the SQL DDL in `DWH-sql-code.txt` (create database + tables like `DimCustomer`, `DimProduct`, `FactOrder`, etc.).

  Notes:
  - The ETL uses `to_sql(..., if_exists="append")`, so tables should exist with the expected columns (especially the surrogate keys like `customer_key`).

  ### Step 5) Run the ETL

  ```bash
  python main.py
  ```

  If everything is configured correctly, you should see logs like `[1/6] ...` and then `Done successfully.`

### built with love By En.Odai Aqlan
