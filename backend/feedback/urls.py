from django.urls import path
from .views import FeedbackCreateView , StaffDashboardView, AdminDashboardView ,  AdminInfoView , feedback_analysis , ActiveUsersView,FeedbackUpdateView, FeedbackDeleteView, DeleteUserView 

urlpatterns = [
    path('submit/', FeedbackCreateView.as_view(), name='feedback_submit'),
    path('dashboard/staff/', StaffDashboardView.as_view(), name='staff_dashboard'),
    path('dashboard/admin/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('info/', AdminInfoView.as_view(), name='admin_info'),
    path('analysis/', feedback_analysis, name='feedback_analysis'),
    path('active-users/', ActiveUsersView.as_view(), name='active_users'),
    path('<int:pk>/edit/', FeedbackUpdateView.as_view(), name='feedback-edit'),
    path('<int:pk>/delete/', FeedbackDeleteView.as_view(), name='feedback-delete'),
    path('<str:username>/', DeleteUserView.as_view(), name='delete_user'), # Add this line 
]
