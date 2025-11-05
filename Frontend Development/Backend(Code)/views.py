# from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import HttpResponseNotFound
from django.http import QueryDict
from django.db import transaction
from .serializers import StudentSerializer, ProfessorSerializer, ClassSerialzer
from .serializers import AssignmentSerializer, AssignmentGroupSerializer, AssignmentSerializerWithClassCode
from .serializers import SubmissionSerializer, CurrentSubmissionSerializer, CommentSerializer, SubmissionFileSerializer
from .models import User, Class, Assignment, AssignmentGroup, AssignmentSubmission, AssignmentSubmissionComment, AssignmentSubmissionFile

# Create your views here.


class StudentView(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = User.objects.filter(is_teacher=False)

    def list(self, request):
        class_id = request.GET.get('class', None)
        if class_id is None:
            # list all students: api/students
            serializer = StudentSerializer(self.queryset, many=True)
            return Response(serializer.data)
        else:
            # list students for given class: api/students/?class=<id>
            queryset = Class.objects.get(id=class_id).students.all()
            serializer = StudentSerializer(queryset, many=True)
            return Response(serializer.data)


class ProfessorView(viewsets.ModelViewSet):
    serializer_class = ProfessorSerializer
    queryset = User.objects.filter(is_teacher=True)


class ClassView(viewsets.ModelViewSet):
    serializer_class = ClassSerialzer
    queryset = Class.objects.all()

    def list(self, request):
        teacher = request.GET.get('teacher', None)
        student = request.GET.get('student', None)
        if (teacher is None and student is None):
            # list all classes: api/classes
            serializer = ClassSerialzer(self.queryset, many=True)
            return Response(serializer.data)
        elif student is None:
            # list classes for given teacher: api/classes/?teacher=<id>
            queryset = self.queryset.filter(teacher__id=teacher)
            serializer = ClassSerialzer(queryset, many=True)
            return Response(serializer.data)
        elif teacher is None:
            # list classes for given student: api/classes/?student=<id>
            queryset = self.queryset.filter(students__id=student)
            serializer = ClassSerialzer(queryset, many=True)
            return Response(serializer.data)
        else:
            HttpResponseNotFound(f"Class(es) not found")

    def create(self, request):
        # POST /api/classes/
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    @action(detail=True)
    def assignments(self, request, pk=None):
        # list assignments for given class: api/classes/<id>/assignments
        queryset = Assignment.objects.filter(course__id=pk)
        serializer = AssignmentSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def user_assignments(self, request):
        # /api/classes/user_assignments/?user_id=<user_id>
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id parameter is required"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if user.is_teacher:
            classes = self.queryset.filter(teacher=user)
        else:
            classes = self.queryset.filter(students__id=user_id)

        assignments = Assignment.objects.filter(
            course__in=classes
        ).select_related('course').order_by('-submission_deadline')

        serializer = AssignmentSerializerWithClassCode(assignments, many=True)
        return Response(serializer.data)

    @action(detail=False, url_path='student-assignments')
    def get_student_class_assignments(self, request):
        # /api/classes/student-assignments/?student_id=<id>&class_id=<id>
        student_id = request.query_params.get('student_id')
        class_id = request.query_params.get('class_id')

        if not student_id or not class_id:
            return Response(
                {"error": "Need both of student id and class id"},
            )

        try:
            # Check if the student in the class
            Class.objects.get(id=class_id, students__id=student_id)
        except Class.DoesNotExist:
            return Response(
                {"error": "No class or no student found"},
            )

        assignments = Assignment.objects.filter(
            course__id=class_id
        ).select_related('course')

        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='get-instructor')
    def get_course_instructor(self, request):
        # /api/classes/get-instructor/?course_id=<id>
        course_id = request.query_params.get('course_id')

        if not course_id:
            return Response(
                {"error": "need course id"},
            )

        try:
            course = Class.objects.get(id=course_id)
            instructor = {
                "id": course.teacher.id,
                "name": course.teacher.name,
                "email": course.teacher.email
            }
            return Response(instructor)

        except Class.DoesNotExist:
            return Response(
                {"error": "no matched course"},
            )


class AssignmentView(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    queryset = Assignment.objects.all()

    @transaction.atomic  # https://docs.djangoproject.com/en/5.1/topics/db/transactions/
    def create(self, request):
        # POST /api/assignments/
        assignment_data = request.data.get('assignment', {})
        groups_data = request.data.get('groups', [])

        assignment_serializer = self.get_serializer(data=assignment_data)
        if assignment_serializer.is_valid():
            assignment = assignment_serializer.save()

            for group_data in groups_data:
                group = AssignmentGroup.objects.create(assignment=assignment)

                for user_id in group_data.get('members', []):
                    group.users.add(user_id)

            # get generated assignment and group
            response_data = {
                'assignment': assignment_serializer.data,
                'groups': AssignmentGroupSerializer(AssignmentGroup.objects.filter(assignment=assignment), many=True).data
            }
            return Response(response_data)
        else:
            # error on assignment
            return Response(assignment_serializer.errors)

    @action(detail=True)
    def groups(self, request, pk=None):
        # list groups for given assignment: api/assignments/<id>/groups
        queryset = AssignmentGroup.objects.filter(assignment__id=pk)
        serializer = AssignmentGroupSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def submissions(self, request, pk=None):
        # list submissions for given assignment: api/assignments/<id>/submissions
        student = request.GET.get('student', None)
        current = True if request.GET.get(
            'current', "").lower() in ('true', 'yes') else False
        if student is None:
            # list all submissions for assignment: api/assignments/<id>/submissions
            queryset = AssignmentSubmission.objects.filter(assignment__id=pk)
            serializer = SubmissionSerializer(queryset, many=True)
            return Response(serializer.data)
        elif not current:
            # list assignment submissions for given student: api/assignments/<id>/submissions/?student=<id>
            queryset = AssignmentSubmission.objects.filter(
                assignment__id=pk, user__id=student)
            serializer = SubmissionSerializer(queryset, many=True)
            return Response(serializer.data)
        else:
            # show current assignment submission for given student: api/assignments/<id>/submissions/?student=<id>&current=true
            queryset = AssignmentSubmission.objects.filter(
                assignment__id=pk, user__id=student, is_current=True)
            serializer = CurrentSubmissionSerializer(queryset, many=True)
            return Response(serializer.data)


class SubmissionView(viewsets.ModelViewSet):
    serializer_class = CurrentSubmissionSerializer
    queryset = AssignmentSubmission.objects.all()

    @transaction.atomic
    def create(self, request):
        # POST /api/submit/
        submission_data = request.data.get('submission', {})
        files_data = request.data.get('files', [])

        submission_serializer = SubmissionSerializer(data=submission_data)
        if submission_serializer.is_valid():
            submission = submission_serializer.save()

            saved_files = []
            for file_data in files_data:
                file_data['submission'] = submission.id
                file_serializer = SubmissionFileSerializer(data=file_data)
                if file_serializer.is_valid():
                    saved_file = file_serializer.save()
                    saved_files.append(saved_file)
                else:
                    return Response(file_serializer.errors)

            response_data = {
                'submission': submission_serializer.data,
                'files': SubmissionFileSerializer(saved_files, many=True).data
            }
            return Response(response_data)
        else:
            return Response(submission_serializer.errors)


class CommentsView(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = AssignmentSubmissionComment.objects.all()


class SubmissionFileView(viewsets.ModelViewSet):
    serializer_class = SubmissionFileSerializer
    queryset = AssignmentSubmissionFile.objects.all()

    def get_queryset(self):
        # GET api/addfile/?submission_id=<id>
        queryset = super().get_queryset()
        submission_id = self.request.query_params.get('submission_id', None)
        if submission_id is not None:
            queryset = queryset.filter(submission__id=submission_id)
        return queryset
