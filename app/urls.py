from django.urls import path
from .views import (
    ProjectListCreateView,
    ContactSubmissionCreateView,
    QuickLinkListView,
    hire_request,
    ProfilePictureView,
    ProfileCVView,
    SyncGithubProjectsView
)

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/sync-github/', SyncGithubProjectsView.as_view(), name='sync-github'),
    path('contact/', ContactSubmissionCreateView.as_view(), name='contact-submission'),
    path('quicklinks/', QuickLinkListView.as_view(), name='quicklinks-list'),
    path('hire/', hire_request, name='hire-request'),
    path('profile/picture/', ProfilePictureView.as_view(), name='profile-picture'),
    path('profile/cv/', ProfileCVView.as_view(), name='profile-cv'),
]
