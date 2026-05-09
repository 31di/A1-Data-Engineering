# Apache NiFi Assignment Eng-Ahmed

## 📂 Structure

- **nifi_project_documentation.pdf**  
  Contains the explanation, design decisions, and step‑by‑step description of the solution, everything.
- **dataflow.json**  
  Exported Apache NiFi flow (processors + controller services).
- **genrator.py**  
  Python script that simulates real-time transaction JSON files (includes some missing values, different status casing, and occasional duplicates).

## How to Use

1. Import `dataflow.json` into Apache NiFi.
2. Enable/Configure controller services (JSON Reader/Writer, Redis cache, Hadoop config files for HDFS).
3. Make sure the input folder in the NiFi `ListFile` processor matches where the generator writes files.
4. Run the generator:
   - `python genrator.py`
5. Start the NiFi processors and confirm the output is written to HDFS.

## Built With Love by odai Aqlan