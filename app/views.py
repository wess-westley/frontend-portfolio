from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Project, ContactSubmission, QuickLink, HireRequest
from .serializers import (
    ProjectSerializer,
    ContactSubmissionSerializer,
    QuickLinkSerializer,
    HireRequestSerializer,
)
import requests
import logging

logger = logging.getLogger(__name__)

# --- GitHub Sync ---
class SyncGithubProjectsView(APIView):
    def post(self, request):
        username = request.data.get('username')
        logger.debug(f"Sync request received. Payload: {request.data}")
        if not username:
            logger.error("GitHub Sync Error: Missing 'username'")
            return Response({'error': 'GitHub username is required'}, status=status.HTTP_400_BAD_REQUEST)

        url = f'https://api.github.com/users/{username}/repos'
        logger.debug(f"Fetching GitHub repos from: {url}")
        response = requests.get(url)

        if response.status_code != 200:
            logger.error(f"GitHub API Error: Received status {response.status_code}")
            return Response({'error': 'Failed to fetch GitHub repos'}, status=response.status_code)

        repos = response.json()
        titles = [repo['name'] for repo in repos]
        logger.debug(f"GitHub repos fetched: {titles}")
        return Response({'projects': titles}, status=status.HTTP_200_OK)


# --- Public Profile ---
class ProfilePictureView(APIView):
    def get(self, request):
        picture_url = getattr(settings, 'PROFILE_PICTURE_URL', '')
        return Response({'imageUrl': picture_url})  # <-- matches React frontend


class ProfileCVView(APIView):
    def get(self, request):
        cv_url = getattr(settings, 'PROFILE_CV_URL', '')
        return Response({'cvUrl': cv_url})  # <-- matches React frontend


# --- Project CRUD ---
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


# --- Contact Form ---
class ContactSubmissionCreateView(generics.CreateAPIView):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        send_mail(
            subject=f"New Contact Form Submission from {instance.name}",
            message=f"Message: {instance.message}\n\nEmail: {instance.email}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_EMAIL],
            fail_silently=True,
        )


# --- Quick Links ---
class QuickLinkListView(generics.ListAPIView):
    queryset = QuickLink.objects.all()
    serializer_class = QuickLinkSerializer


# --- Public Test View ---
class PublicView(APIView):
    def get(self, request):
        return Response({"message": "This is a public portfolio view!"})


# --- Hire Me ---
@api_view(['POST'])
def hire_request(request):
    serializer = HireRequestSerializer(data=request.data)

    if serializer.is_valid():
        try:
            instance = serializer.save()

            # Host (Westley) details
            user_data = {
                "username": "Westley Gitau",
                "email": "westleykanyora9@gmail.com",  
                "phone": getattr(settings, "PROFILE_PHONE", "Not provided"),
                "github_url": "https://github.com/westley-wess",
                "linkedin_url": "https://linkedin.com/in/westleygitau",
                "aws_cert_url": "Not provided",
                "resume_url": getattr(settings, "PROFILE_CV_URL", ""),
            }

            # Send email to Westley
            send_mail(
                subject=f"New Hire Request from {instance.company_name}",
                message=(
                    f"--- Hire Request Details ---\n"
                    f"Applicant Name: {instance.applicant_name}\n"
                    f"Applicant Email: {instance.applicant_email}\n"
                    f"Applicant Phone: {instance.applicant_phone}\n"
                    f"Company: {instance.company_name}\n"
                    f"Role: {instance.role}\n"
                    f"Offered Salary: {instance.offered_salary}\n\n"
                    f"Message:\n{instance.message}\n\n"
                    f"--- Westley's Profile ---\n"
                    f"Phone: {user_data['phone']}\n"
                    f"GitHub: {user_data['github_url']}\n"
                    f"LinkedIn: {user_data['linkedin_url']}\n"
                    f"AWS Certifications: {user_data['aws_cert_url']}\n"
                    f"Resume: {user_data['resume_url']}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=False,
            )

            # Send confirmation to applicant
            send_mail(
                subject="Your hire request was received!",
                message=(
                    f"Hi {instance.applicant_name},\n\n"
                    "Thank you for contacting Westley.\n"
                    "Your hire request has been received successfully.\n"
                    "Westley will reach out to you shortly.\n\n"
                    "Best regards,\nWestley's Team"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.applicant_email],
                fail_silently=True,
            )

            return Response({'message': 'Hire request sent successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'message': f'Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
