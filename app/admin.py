from django.contrib import admin
from .models import Project, ContactSubmission, QuickLink

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'tech_stack', 'created_at', 'updated_at')
    search_fields = ('title', 'tech_stack')
    list_filter = ('created_at', 'updated_at')

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'submission_type', 'submitted_at')
    search_fields = ('name', 'email', 'message')
    list_filter = ('submission_type', 'submitted_at')

@admin.register(QuickLink)
class QuickLinkAdmin(admin.ModelAdmin):
    list_display = ('title', 'url', 'order', 'is_download')
    search_fields = ('title', 'url')
    list_filter = ('is_download',)
