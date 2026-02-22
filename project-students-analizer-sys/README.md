# Student System (Student Performance Analyzer)

A simple Python project to manage a list of students stored in a CSV file and analyze their performance (average, top/lowest student, ranking, and grade distribution).

## Project Overview
- Students are loaded from `data.csv`.
- Each student has: name, student ID, and three grades.
- The app runs as an interactive console menu.

## How to Run
### Requirements
- Python 3.x
- No external dependencies (standard library only).

### Run the Program
From the project folder, run:

```bash
python main.py
```

After it starts, you will see menu options such as:
- Show all students
- Add a student
- Remove a student
- Search for a student by ID
- Show classroom average
- Show top / lowest student
- Rank students
- Show grade distribution (A/B/C/D/F)

## Data Format (`data.csv`)
Each row represents a student in the following format:

```csv
name,student_id,grade1,grade2,grade3
```

Example:
```csv
odai,3003,50.0,50.0,60.0
ali,1726,44.0,44.0,77.0
```

## Key Files
- `main.py`: Entry point and interactive menu.
- `models.py`: Student model and classroom management.
- `utils.py`: CSV load/save/remove + converting raw CSV text into objects.
- `analytics.py`: Analysis functions (top/lowest/ranking/grade distribution).
- `data.csv`: Data file (simple CSV-based storage).

## Notes
- When you add a new student from the menu, it is appended to `data.csv`.
- When you remove a student, it is removed from memory and from `data.csv`.

## By Odai Aqlan
