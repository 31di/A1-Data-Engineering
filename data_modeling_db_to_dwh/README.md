#  Book Sales Data Warehouse 

## Objective
This Data Warehouse was designed to support **book sales analysis**.  
It provides management with insights into:
- Best-selling books over specific periods  
- Top customers by region or country  
- Publisher performance comparisons  
- Impact of shipping methods on sales  
- Monthly and yearly sales growth trends  

---
##  Business Process
The chosen business process is **Sales Analysis**.  
- Sales are the core activity of the book ordering system.  
- Tracking sales transactions allows the business to measure performance, identify trends, and make data-driven decisions.

---

## Fact Table Type
We implemented a **Transaction Fact Table** because:
- Each row represents a single sales transaction (order line).  
- This ensures detailed granularity.  
- It allows aggregation across multiple dimensions such as time, customer, book, publisher, and shipping method.

---

## Fact Table Design
**Fact_Order_Sales** contains:
- **Measures:**  
  - Sales_Amount  
  - Quantity_Sold  
- **Foreign Keys (linked dimensions):**  
  - Date_ID → Dim_Time  
  - Customer_ID → Dim_Customer  
  - Book_ID → Dim_Book  
  - Publisher_ID → Dim_Publisher  
  - Shipping_Method_ID → Dim_Shipping_Method  

---

## Dimensions
- **Dim_Customer:** Customer details (name, email, status, country)  
- **Dim_Book:** Book details (title, ISBN, pages, publication date)  
- **Dim_Publisher:** Publisher information  
- **Dim_Shipping_Method:** Shipping method and cost  
- **Dim_Time:** Calendar attributes (day, month, quarter, year, day of week)  
- *(Optional extensions: Dim_Author, Dim_Country, Dim_Language)*  

---

## Why This Design
- **Transaction Fact Table** ensures detailed tracking of each sale.  
- Dimensions provide descriptive context for analysis.  
- Only relevant dimensions were connected as foreign keys to keep the schema simple and efficient.  
- Operational tables (like order history or address status) were excluded since they don’t add direct analytical value.  
- The result is a **Star Schema** that is easy to query, scalable, and supports both detailed and aggregated reporting.

---
