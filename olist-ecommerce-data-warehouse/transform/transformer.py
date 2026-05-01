import pandas as pd


def transform_products(df):
    df["product_category_name"] = df["product_category_name"].fillna("Unknown")
    num_cols = [
        "product_weight_g",
        "product_width_cm",
        "product_height_cm",
        "product_length_cm",
    ]
    df[num_cols] = df[num_cols].fillna(df[num_cols].mean())
    return df


def make_date_key(series):
    return (
        series.astype(str)
        .str.replace("-", "")
        .replace(["NaT", "nan", "None"], "0")
        .fillna("0")
        .astype(int)
    )


def make_time_key(series):
    return (
        series.astype(str)
        .str.replace(":", "")
        .str.replace(".", "")
        .replace(["NaT", "nan", "None"], "0")
        .fillna("0")
        .astype(int)
    )


def key_to_datetime(series):
    return pd.to_datetime(
        series.replace(0, pd.NA),  # استبدال 0 بـ NA
        format="%Y%m%d",
        errors="coerce",  # أي قيمة غير صالحة تتحول NaT
    )


def transform_orders(df_order):
    timedate = [
        "order_purchase_timestamp",
        "order_approved_at",
        "order_delivered_carrier_date",
        "order_delivered_customer_date",
        "order_estimated_delivery_date",
    ]
    df_order[timedate] = df_order[timedate].apply(pd.to_datetime)

    df_order[
        (df_order["order_status"] == "delivered")
        & (df_order[timedate].isna().any(axis=1))
    ].dropna(inplace=True)

    df_order["purchase_date"] = df_order["order_purchase_timestamp"].dt.date
    df_order["purchase_time"] = df_order["order_purchase_timestamp"].dt.time
    df_order["approved_date"] = df_order["order_approved_at"].dt.date
    df_order["approved_time"] = df_order["order_approved_at"].dt.time

    df_order["carrier_date"] = df_order["order_delivered_carrier_date"].dt.date
    df_order["carrier_time"] = df_order["order_delivered_carrier_date"].dt.time

    df_order["delivered_date"] = df_order["order_delivered_customer_date"].dt.date
    df_order["delivered_time"] = df_order["order_delivered_customer_date"].dt.time

    df_order["estimated_date"] = df_order["order_estimated_delivery_date"].dt.date

    df_order["date_purchase_key"] = make_date_key(df_order["purchase_date"])
    df_order["date_approved_key"] = make_date_key(df_order["approved_date"])
    df_order["date_delivered_carrier_key"] = make_date_key(df_order["carrier_date"])
    df_order["date_delivered_customer_key"] = make_date_key(df_order["delivered_date"])
    df_order["date_estimated_key"] = make_date_key(df_order["estimated_date"])

    df_order["time_purchase_key"] = make_time_key(df_order["purchase_time"])
    df_order["time_approved_key"] = make_time_key(df_order["approved_time"])
    df_order["time_delivered_carrier_key"] = make_time_key(df_order["carrier_time"])
    df_order["time_delivered_customer_key"] = make_time_key(df_order["delivered_time"])

    df_order.drop_duplicates(inplace=True)

    df_order.drop(
        columns=[
            "order_purchase_timestamp",
            "order_approved_at",
            "order_delivered_carrier_date",
            "order_delivered_customer_date",
            "order_estimated_delivery_date",
            "purchase_date",
            "purchase_time",
            "approved_date",
            "approved_time",
            "carrier_date",
            "carrier_time",
            "delivered_date",
            "delivered_time",
            "estimated_date",
        ],
        inplace=True,
    )

    df_order = df_order.rename(
        columns={"customer_key": "customer_id", "seller_key": "seller_id"}
    )

    purchase_dt = key_to_datetime(df_order["date_purchase_key"])
    delivered_dt = key_to_datetime(df_order["date_delivered_customer_key"])
    estimated_dt = key_to_datetime(df_order["date_estimated_key"])

    df_order["delivery_duration"] = delivered_dt - purchase_dt
    df_order["is_late_delivery"] = delivered_dt > estimated_dt

    return df_order


def enrich_orders_with_customer_key(df_order, dim_customer):
    df_order = df_order.merge(dim_customer, on="customer_id", how="left")
    df_order["customer_key"] = df_order["customer_key"].fillna(0).astype(int)
    return df_order


def finalize_factorder(df_order):
    df_order = df_order[
        [
            "order_id",
            "customer_key",
            "total_payment",
            "total_sellers",
            "total_items",
            "order_status",
            "date_purchase_key",
            "date_approved_key",
            "date_delivered_carrier_key",
            "date_delivered_customer_key",
            "date_estimated_key",
            "time_purchase_key",
            "time_approved_key",
            "time_delivered_carrier_key",
            "time_delivered_customer_key",
            "delivery_duration",
            "is_late_delivery",
        ]
    ]

    df_order["delivery_duration"] = df_order["delivery_duration"].astype(str)

    duplicates = df_order[df_order.duplicated(subset=["order_id"], keep=False)]
    duplicates.info()

    df_order = df_order.drop_duplicates(subset=["order_id"])
    return df_order
