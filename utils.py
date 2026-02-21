import csv
import io


def load_data(file_path):
    with open(file_path, "r") as file:
        data = file.read()
        if not data:
            raise ValueError("the file is empty")
    return data


def save_data(file_path, name, student_id, grades, mode="a"):
    if name is None or student_id is None or grades is None:
        raise ValueError("name, student_id, and grades are required")
    # isinstance من خلاله اقدر اتحقق من الداتا تايب
    if not isinstance(grades, (list, tuple)):
        raise TypeError("grades must be a list or tuple")

    with open(file_path, mode, newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([name, student_id, *grades])


    #يفتح الملف يقراه من غير المطلوب حذفه ويكتب فيه البيانات الجديدة
def remove_data(file_path, student_id):
    with open(file_path, "r", newline="", encoding="utf-8") as file:
        reader = csv.reader(file)
        students = [row for row in reader if row and row[1].strip() != str(student_id)]

    with open(file_path, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerows(students)



def validate_student_data(name, grades):
    if not name or not isinstance(name, str):
        raise ValueError("Name must be a non-empty string")
    if not isinstance(grades, (list, tuple)) or not all(
        isinstance(g, (int, float)) for g in grades
    ):
        raise ValueError("Grades must be a list or tuple of numbers")    


def convert_data_to_objects(data):
    if not data:
        return []

    import models as m

    students = []
    reader = csv.reader(io.StringIO(data))
    for row in reader:
        if not row:
            continue
        if len(row) < 5:
            continue

        name = row[0].strip()
        student_id_raw = row[1].strip()
        try:
            grades = [float(row[2]), float(row[3]), float(row[4])]
        except (ValueError, TypeError, IndexError):
            continue

        # If the first row is a header, skip it.
        if student_id_raw.lower() in {"id", "student_id"}:
            continue

        try:
            student_id = int(student_id_raw)
        except ValueError:
            student_id = student_id_raw

        students.append(m.student(name, *grades, student_id=student_id))

    return students
