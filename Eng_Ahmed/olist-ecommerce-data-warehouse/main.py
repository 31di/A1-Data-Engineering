from extract.extractor import (
    extract_customers,
    extract_orders,
    extract_products,
    extract_sellers,
    get_sqlite_connection,
)
from load.loader import (
    fetch_dim_customer,
    get_engine,
    load_dimcustomer,
    load_dimproduct,
    load_dimseller,
    load_factorder,
)
from transform.transformer import (
    enrich_orders_with_customer_key,
    finalize_factorder,
    transform_orders,
    transform_products,
)


def main():
    print("[1/6] Opening SQLite connection...")
    conn = get_sqlite_connection()

    print("[2/6] Extracting products...")
    df = extract_products(conn)
    print("    rows:", len(df))

    print("[3/6] Transforming/cleaning products...")
    df = transform_products(df)

    print("[4/6] Opening PostgreSQL connection...")
    engine = get_engine()
    print("[5/6] Loading dimensions (dimproduct/dimcustomer/dimseller)...")
    load_dimproduct(df, engine)
    print("    dimproduct loaded rows:", len(df))

    df_customer = extract_customers(conn)
    load_dimcustomer(df_customer, engine)
    print("    dimcustomer loaded rows:", len(df_customer))

    df_seller = extract_sellers(conn)
    load_dimseller(df_seller, engine)
    print("    dimseller loaded rows:", len(df_seller))

    print("[6/6] Extracting/transforming/loading factorder...")
    df_order = extract_orders(conn)
    print("    extracted orders rows:", len(df_order))
    df_order = transform_orders(df_order)
    print("    transformed orders rows:", len(df_order))

    dim_customer = fetch_dim_customer(engine)
    df_order = enrich_orders_with_customer_key(df_order, dim_customer)
    df_order = finalize_factorder(df_order)
    print("    final factorder rows:", len(df_order))

    load_factorder(df_order, engine)
    print("Done successfully.")

    conn.close()


if __name__ == "__main__":
    main()
