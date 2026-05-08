# Eng-sharief Hive Assignment

## 📂 Structure

- **hive_document.pdf**  
  Contains the explanation, design decisions, and step‑by‑step description of the solution.  
- **hive secript.sql**  
  Hive SQL script with the full implementation of the SCD2 logic and table operations.

## Overview

- Creating **internal and external tables** and loading data.
- Fixing the **delimiter issue** in the address column using Hive SerDe settings.
- Dropping internal vs external tables to observe the difference in how Hive manages data.
- Building a **customer dimension table** with **Slowly Changing Dimension Type 2 (SCD2)** logic.
- Using `customer_updated.csv` to insert new records and close old ones.
- Applying the **Staging Table Approach** as a workaround since Hive does not support direct `UPDATE` or `DELETE` on non-transactional tables.

## How to Use

1. Read **hive_document.pdf** for background and reasoning.  
2. run  **hive secript.sql** in any sql editor can connect with hive or beeline in cmd create tables,
