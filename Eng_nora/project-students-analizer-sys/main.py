from analytics import (
    Lowest_performing_student,
    Ranking_students,
    grade_distribution,
    top_performing_students,
)

import models as m
import utils


def main():
    filename = "data.csv"
    classroom = m.Classroom()
    try:
        data_now = utils.load_data(filename)
        print("Data loaded successfully:")
        students = utils.convert_data_to_objects(data_now)
        m.classroom.set_students(students)
    except ValueError as e:
        print(f"Error loading data: {e}")

    while True:
        print("\n--- Student Performance Analyzer ---")
        print("0. show all students")
        print("1. Add Student")
        print("2. Remove Student")
        print("3. Search Student")
        print("4. Show Classroom Average")
        print("5. Show Top Student")
        print("6. Show Lowest Student")
        print("7. Rank Students")
        print("8. Grade Distribution")
        print("9. Exit")
        choice = input("Enter choice: ")

        if choice == "0":
            print("All Students:")
            for student in classroom.get_students():
                print(student)

        elif choice == "1":
            name = input("Enter student name: ")
            grade1 = float(input("Enter grade 1: "))
            grade2 = float(input("Enter grade 2: "))
            grade3 = float(input("Enter grade 3: "))
            
            if not utils.validate_student_data(name, [grade1, grade2, grade3]):
                print("Invalid student data. Please try again.")
                continue
            new_student = classroom.add_student(name, grade1, grade2, grade3)
            utils.save_data(
                filename,
                new_student.get_name(),
                new_student.get_id(),
                new_student.get_grades(),
            )
            print(f"Added successfully: {new_student}")

        elif choice == "2":
            student_id = input("Enter student id to remove: ")
            classroom.remove_student(student_id)

        elif choice == "3":
            student_id = input("Enter student id to search: ")
            found = classroom.search_student(student_id)
            if found:
                print(f"Found student: {found}")
            else:
                print("Student not found.")

        elif choice == "4":
            avg = classroom.class_average()
            print(f"Classroom average: {avg}")

        elif choice == "5":
            top_student = top_performing_students(classroom)
            print(f"Top performing student: {top_student}")

        elif choice == "6":
            lowest_student = Lowest_performing_student(classroom)
            print(f"Lowest performing student: {lowest_student}")

        elif choice == "7":
            ranking = Ranking_students(classroom)
            for i, s in enumerate(ranking, 1):
                print(f"{i}. {s}")

        elif choice == "8":
            distribution = grade_distribution(classroom)
            for grade, count in distribution.items():
                print(f"Grade {grade}: {count} students")

        elif choice == "9":
            break

        else:
            print("Invalid choice. Please try again.")

    # Example usage of the utility functions


if __name__ == "__main__":
    main()
