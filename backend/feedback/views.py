from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from django.core.paginator import Paginator
from rest_framework.decorators import api_view
from django.utils.timezone import now
from datetime import timedelta
from django.contrib.auth.models import User
from authentication.models import CustomUser 
from django.db.models import Count, Case, When


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, username, *args, **kwargs):
        try:
            user = CustomUser.objects.get(username=username, role='Staff')
            user.delete()
            return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)



class FeedbackUpdateView(generics.UpdateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, *args, **kwargs):
        try:
            feedback = Feedback.objects.get(pk=pk, user=request.user)
            serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)


class FeedbackDeleteView(generics.DestroyAPIView):
    queryset = Feedback.objects.all()
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, *args, **kwargs):
        try:
            feedback = Feedback.objects.get(pk=pk, user=request.user)
            feedback.delete()
            return Response({"message": "Feedback deleted successfully."}, status=status.HTTP_200_OK)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)


class ActiveUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filter active users who are staff and exclude admins and superusers
        active_users = CustomUser.objects.filter(is_active=True, role='Staff')
        user_data = [
            {
                'username': user.username,
                'email': user.email,
                'date_joined': user.date_joined,
                'role': user.role  # Include the role in the response
            }
            for user in active_users
        ]
        return Response({"active_users": user_data})



        
class AdminInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the current authenticated user
            user = request.user
            
            # Ensure the user is an admin (assuming you have an 'is_staff' field or similar)
            if not user.is_staff:
                return Response({"error": "Unauthorized: User is not an admin"}, status=403)
            
            # Prepare admin info
            admin_info = {
                "name": user.get_full_name() or user.username,
                "email": user.email,
            }
            return Response(admin_info, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        # Saving feedback with the current logged-in user
        serializer.save(user=self.request.user)

class StaffDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Extract query parameters for search, filter, and pagination
        search_query = request.query_params.get('search', '')
        filter_query = request.query_params.get('category', '')
        page = int(request.query_params.get('page', 1))

        # Get logged-in staff information
        staff_name = request.user.get_full_name() or request.user.username
        staff_email = request.user.email

        # Get feedbacks submitted by the logged-in staff
        feedbacks = Feedback.objects.filter(user=request.user).order_by('-created_at')

        # Apply search and filter
        if search_query:
            feedbacks = feedbacks.filter(
                Q(product_name__icontains=search_query) |
                Q(feedback_text__icontains=search_query)
            )
        if filter_query:
            feedbacks = feedbacks.filter(category=filter_query)

        # Calculate sentiment counts
        sentiment_counts = feedbacks.aggregate(
            positive_count=Count(Case(When(sentiment='Positive', then=1))),
            negative_count=Count(Case(When(sentiment='Negative', then=1))),
            neutral_count=Count(Case(When(sentiment='Neutral', then=1))),
            total_count=Count('id'),
        )

        # Paginate the results (10 items per page)
        paginator = Paginator(feedbacks, 10)
        paginated_feedbacks = paginator.get_page(page)

        # Prepare response data
        response_data = {
            "staff_info": {
                "name": staff_name,
                "email": staff_email
            },
            "feedbacks": list(paginated_feedbacks.object_list.values(
                'id', 'category', 'product_name',
                'feedback_text', 'sentiment', 'created_at'
            )),
            "total_pages": paginator.num_pages,
            "current_page": paginated_feedbacks.number,
            "sentiment_counts": {
                "positive_count": sentiment_counts.get('positive_count', 0),
                "neutral_count": sentiment_counts.get('neutral_count', 0),
                "negative_count": sentiment_counts.get('negative_count', 0),
                "total_count": sentiment_counts.get('total_count', 0),
            },
        }

        return Response(response_data)

    
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Extract query parameters for search, filter, and pagination
        search_query = request.query_params.get('search', '')
        filter_query = request.query_params.get('category', '')
        page = int(request.query_params.get('page', 1))

        # Get logged-in admin information
        admin_name = request.user.get_full_name() or request.user.username
        admin_email = request.user.email

        # Get all feedbacks
        feedbacks = Feedback.objects.all().order_by('-created_at')

        # Apply search and filter
        if search_query:
            feedbacks = feedbacks.filter(
                Q(user__username__icontains=search_query) |
                Q(product_name__icontains=search_query) |
                Q(feedback_text__icontains=search_query)
            )
        if filter_query:
            feedbacks = feedbacks.filter(category=filter_query)

        # Paginate the results (10 items per page)
        paginator = Paginator(feedbacks, 10)
        paginated_feedbacks = paginator.get_page(page)

        # Prepare response data

        response_data = {
            "admin_info": {
                "name": admin_name,
                "email": admin_email
            },
            "feedbacks": list(paginated_feedbacks.object_list.values(
                'id', 'user__username', 'user__email', 'category',
                'product_name', 'feedback_text', 'sentiment', 'created_at'
            )),
            "total_pages": paginator.num_pages,
            "current_page": paginated_feedbacks.number,
        }
        return Response(response_data)
 

@api_view(['GET'])
def feedback_analysis(request):
    today = now()
    today_midnight = today.replace(hour=0, minute=0, second=0, microsecond=0)
    filter_option = request.query_params.get('filter', 'total')

    # Filter feedbacks based on the selected time filter
    if filter_option == 'last7days':
        feedbacks = Feedback.objects.filter(created_at__gte=today - timedelta(days=7))
    elif filter_option == 'lastmonth':
        feedbacks = Feedback.objects.filter(created_at__gte=today - timedelta(days=30))
    elif filter_option == 'today':
        feedbacks = Feedback.objects.filter(created_at__gte=today_midnight)
    else:  # Total feedback
        feedbacks = Feedback.objects.all()

    total_count = Feedback.objects.all().count()  # Total feedbacks in the database
    positive = feedbacks.filter(sentiment="Positive").count()
    negative = feedbacks.filter(sentiment="Negative").count()
    neutral = feedbacks.filter(sentiment="Neutral").count()

    # Adjusting calculations for recent feedbacks
    feedbacks_last_day = Feedback.objects.filter(created_at__gte=today_midnight).count()
    feedbacks_last_week = Feedback.objects.filter(created_at__gte=today - timedelta(days=7)).count()
    feedbacks_last_month = Feedback.objects.filter(created_at__gte=today - timedelta(days=30)).count()

    active_users_count = CustomUser.objects.filter(is_active=True , role='Staff').count()

    return Response({
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "total_count": total_count,
        "feedbacks_last_day": feedbacks_last_day,
        "feedbacks_last_week": feedbacks_last_week,
        "feedbacks_last_month": feedbacks_last_month,
        "active_users_count": active_users_count,
    })
