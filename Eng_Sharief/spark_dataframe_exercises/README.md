# Spark DataFrame Exercises (Eng-Sharief)

## 📂 Structure

- **01_spark_dataframe_basics.ipynb**  
  Intro exercises for creating Spark sessions, reading data, inspecting schema, and basic DataFrame operations.
- **02_dataframe_transformations.ipynb**  
  Practice transformations like `select`, `withColumn`, `filter`, `groupBy`, aggregations, and simple feature engineering.
- **employees.csv**  
  Sample dataset used by the notebooks.

## How to Use

1. Create/activate a Python environment.
2. Install dependencies (minimum):
   - `pyspark`
   - `jupyter` (or `notebook` / `jupyterlab`)
3. Start Jupyter from this folder:
   - `jupyter notebook`
4. Open and run notebooks in order:
   - `01_spark_dataframe_basics.ipynb`
   - `02_dataframe_transformations.ipynb`

## Notes

- If Spark fails to start on Windows, make sure **Java (JDK 8+)** is installed and `JAVA_HOME` is set.
- Keep `employees.csv` in the same directory as the notebooks so relative paths work.

## Built With Love by Eng-Sharief
