import random
import utils


class student:
    def __init__(self, name, *grades, student_id=None):
        self.__name = name
        self.__student_id = (
            int(student_id) if student_id is not None else random.randint(1000, 9999)
        )
        self.__grades = list(grades)

    def __str__(self):
        grades_str = ", ".join(str(g) for g in self.__grades)
        return (
            f"student(name={self.__name!r}, id={self.__student_id!r}, "
            f"grades=[{grades_str}])"
        )

    def get_name(self):
        return self.__name

    def get_id(self):
        return self.__student_id

    def get_grades(self):
        return self.__grades

    def avg(self):
        if not self.__grades:
            return 0
        return sum(self.__grades) / len(self.__grades)

    def category(self):
        average = self.avg()
        if average >= 90:
            return "A"
        elif average >= 80:
            return "B"
        elif average >= 70:
            return "C"
        elif average >= 60:
            return "D"
        else:
            return "F"


class classroom:
    __students = []

    @classmethod
    def set_students(cls, students):
        cls.__students = list(students) if students is not None else []

    # helper function
    @classmethod
    def _same_id(cls, a, b):
        return str(a) == str(b)

    @classmethod
    def get_students(cls):
        return cls.__students

    @classmethod
    def remove_student(cls, student_id):
        if student_id not in [s.get_id() for s in cls.__students]:
            print(f"No student found with ID {student_id}")
            return
        cls.__students = [
            student
            for student in cls.__students
            if not cls._same_id(student.get_id(), student_id)
        ]
        try:
            utils.remove_data("data.csv", student_id)
            print(f"Student with ID {student_id} removed successfully")
        except Exception as e:
            print(f"Error removing student from file: {e}")

    @classmethod
    def search_student(cls, student_id):
        for student in cls.__students:
            if cls._same_id(student.get_id(), student_id):
                return student
        return None

    @classmethod
    def class_average(cls):
        if not cls.__students:
            return 0
        total_avg = sum(student.avg() for student in cls.__students)
        return total_avg / len(cls.__students)

    @classmethod
    def add_student(cls, name, grade1, grade2, grade3):
        new_student = student(name, grade1, grade2, grade3)
        cls.__students.append(new_student)
        return new_student


# Alias to match usage in main.py
Classroom = classroom
