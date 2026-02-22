def top_performing_students(classroom):
    students = classroom.get_students()
    if not students:
        return []
    top_student = max(students, key=lambda s: s.avg())
    return top_student


def Lowest_performing_student(classroom):
    students = classroom.get_students()
    if not students:
        return []
    lowest_student = min(students, key=lambda s: s.avg())
    return lowest_student

def Ranking_students(classroom):
    students = classroom.get_students()
    if not students:
        return []
    ranked_students = sorted(students, key=lambda s: s.avg(), reverse=True)
    return ranked_students

def grade_distribution(classroom):
    distribution = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
    for student in classroom.get_students():
        category = student.category()
        distribution[category] += 1
    return distribution