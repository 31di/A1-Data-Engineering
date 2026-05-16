# Apache NiFi + Kafka + Hadoop Pipeline

## Structure

- **NiFi_Pipeline_Documentation.pdf**  
  Contains the explanation, design decisions, and step-by-step description of the pipeline.

- **nifi-flow.json**  
  Exported Apache NiFi flow (process groups + processors + controller services) that implements the end-to-end pipeline:
  ingestion (files) → chunking → transformation/validation → Kafka → HDFS.

- **script.py**  
  Python script that simulates real-time banking transaction CSV files (includes some missing values, invalid types, negative amounts, and occasional duplicates). It writes files into `lab_data/input`.

- **Architecture Diagram.png**  
  High-level architecture diagram for the pipeline.

- **process-groups-imags/**  
  Screenshots of the NiFi process groups and sample outputs.

## Built With Love by odai Aqlan
