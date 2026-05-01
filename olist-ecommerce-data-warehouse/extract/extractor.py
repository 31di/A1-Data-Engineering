import pandas as pd
import sqlite3

from config.settings import SQLITE_PATH


def get_sqlite_connection(sqlite_path: str = SQLITE_PATH):
    return sqlite3.connect(sqlite_path)


def extract_products(conn):
    df = pd.read_sql(
        "SELECT product_id ,product_category_name ,product_weight_g,product_length_cm ,product_height_cm ,product_width_cm FROM products",
        conn,
    )
    return df


def extract_customers(conn):
    df_customer = pd.read_sql(
        "SELECT customer_id,customer_unique_id, customer_city, customer_state from customers",
        conn,
    )
    return df_customer


def extract_sellers(conn):
    df_seller = pd.read_sql(
        "SELECT seller_id,seller_city,seller_state from sellers",
        conn,
    )
    return df_seller


def extract_orders(conn):
    df_order = pd.read_sql(
        """
SELECT  
	o.order_id,
	o.customer_id,
	SUM(p.payment_value) AS total_payment,        -- مجموع الدفعات
	COUNT(DISTINCT oi.seller_id) AS total_sellers, -- عدد البائعين في الطلب
	COUNT(oi.order_item_id) AS total_items,        -- عدد المنتجات
	o.order_status,
	o.order_purchase_timestamp,
	o.order_approved_at,
	o.order_delivered_carrier_date,
	o.order_delivered_customer_date,
	o.order_estimated_delivery_date
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN order_payments p ON o.order_id = p.order_id
GROUP BY 
	o.order_id,
	o.customer_id,
	o.order_status,
	o.order_purchase_timestamp,
	o.order_approved_at,
	o.order_delivered_carrier_date,
	o.order_delivered_customer_date,
	o.order_estimated_delivery_date;


 """,
        conn,
    )
    return df_order
