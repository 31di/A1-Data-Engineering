from sqlalchemy import create_engine
import logging

import pandas as pd

from config.settings import PG_URI


def get_engine(pg_uri: str = PG_URI):
    return create_engine(pg_uri)


def load_dimproduct(df, engine):
    with engine.connect() as connection:
        df.to_sql("dimproduct", con=connection, if_exists="append", index=False)


def load_dimcustomer(df_customer, engine):
    with engine.connect() as connection:
        df_customer.to_sql(
            "dimcustomer", con=connection, if_exists="append", index=False
        )


def load_dimseller(df_seller, engine):
    with engine.connect() as connection:
        df_seller.to_sql("dimseller", con=connection, if_exists="append", index=False)


def fetch_dim_customer(engine):
    with engine.connect() as connection:
        dim_customer = pd.read_sql(
            "SELECT customer_id, customer_key FROM DimCustomer",
            con=connection,
        )
    return dim_customer


def load_factorder(df_order, engine):
    with engine.connect() as connection:
        df_order.to_sql("factorder", con=connection, if_exists="append", index=False)


def load_table(df, pg_conn_str, target_table):
    try:
        engine = create_engine(pg_conn_str)
        df.to_sql(target_table, engine, if_exists="append", index=False, chunksize=1000)
        logging.info(f"Loaded {len(df)} rows into {target_table}")
    except Exception as e:
        logging.error(f"Load failed for {target_table}: {e}")
        raise
