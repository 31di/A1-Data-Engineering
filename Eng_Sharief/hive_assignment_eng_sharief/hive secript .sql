use test;
SELECT  * FROM customer_internal;
SELECT current_database();

DROP table customer_internal;


DROP TABLE table_name PURGE;


create external table customer_external (
  customer_id INT,
  name STRING,
  email STRING,
  phone_number STRING,
  address STRING,
  join_date DATE,
  start_date DATE,
  end_date DATE,
  is_current STRING
)
Row format serde 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
with serdeproperties (
  "separatorChar" = ",",
  "quoteChar" = "\""
)
stored as textfile
location '/ext/cus/'
tblproperties('skip.header.line.count'='1');


create external table tst_external (
  customer_id INT,
  name STRING,
  email STRING,
  phone_number STRING,
  address STRING,
  join_date DATE,
  start_date DATE,
  end_date DATE,
  is_current STRING
)
Row format serde 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
with serdeproperties (
  "separatorChar" = ",",
  "quoteChar" = "\""
)
stored as textfile
location '/ext/cus/'
tblproperties('skip.header.line.count'='1');
LOAD DATA LOCAL INPATH '/data/odai/customer_scd2_mixed.csv' INTO TABLE test.customer_external;



DROP TABLE customer_external;
DROP TABLE customer_internal;
SELECT * FROM customer_external LIMIT 5;


CREATE TABLE customer_dim (
  customer_id INT,
  name STRING,
  email STRING,
  phone_number STRING,
  address STRING,
  join_date DATE,
  start_date DATE,
  end_date DATE,
  is_current STRING
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES (
  "separatorChar" = ",",
  "quoteChar" = "\""
)
STORED AS TEXTFILE
TBLPROPERTIES ('skip.header.line.count'='1');

LOAD DATA LOCAL INPATH '/data/odai/customer_scd2_mixed.csv'INTO TABLE customer_dim;



CREATE TABLE customer_staging (
  customer_id INT,
  name STRING,
  email STRING,
  phone_number STRING,
  address STRING,
  join_date DATE
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES (
  "separatorChar" = ",",
  "quoteChar" = "\""
)
STORED AS TEXTFILE
TBLPROPERTIES ('skip.header.line.count'='1');

LOAD DATA LOCAL INPATH '/data/odai/customer_updated.csv' INTO TABLE customer_staging;

INSERT OVERWRITE TABLE customer_dim
SELECT
  d.customer_id,
  d.name,
  d.email,
  d.phone_number,
  d.address,
  d.join_date,
  CAST(d.start_date AS DATE) AS start_date,
  CASE 
    WHEN s.customer_id IS NOT NULL THEN CAST(current_date() AS DATE)
    ELSE CAST(d.end_date AS DATE)
  END AS end_date,
  CASE 
    WHEN s.customer_id IS NOT NULL THEN '0'
    ELSE d.is_current
  END AS is_current
FROM customer_dim d
LEFT JOIN customer_staging s
ON d.customer_id = s.customer_id

UNION ALL

SELECT
  s.customer_id,
  s.name,
  s.email,
  s.phone_number,
  s.address,
  s.join_date,
  CAST(current_date() AS DATE) AS start_date,
  CAST(NULL AS DATE) AS end_date,
  '1' AS is_current
FROM customer_staging s;


SELECT 
  customer_id,
  name,
  address,
  start_date,
  end_date,
  is_current
FROM customer_dim
WHERE customer_id IN (
  SELECT customer_id
  FROM customer_dim
  GROUP BY customer_id
  HAVING COUNT(*) > 1
)
ORDER BY customer_id, start_date;

