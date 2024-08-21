from django.urls import path, include
from . import views


urlpatterns = [
    path('login/', views.sign_in, name="login"),
    path('admin_page/', views.admin_page, name="admin_page"),
    path('admin_page/generate_url/', views.generate_url, name="generate_url"),
    path('slots/<str:access_code>/', views.slots_web, name="slots"),
    path('slots/<str:access_code>/slots_game/', views.slots_game, name="slots_game")
]
