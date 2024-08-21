from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User, Group
from django.contrib import messages
import uuid, secrets
from .models import OneTimeLinkModel


def slots_web(request, access_code):
    if OneTimeLinkModel.objects.filter(onetime_url=access_code).exists():
        OneTimeLinkModel.objects.filter(onetime_url=access_code).delete()
        return render(request, "../templates/slots_template/slots.html", {})
    else:
        return render(request, "../templates/admin_signin/darkpan/404.html", {})
    

def slots_game(request, access_code):
    slot_value = secrets.randbelow(10)
    if request.method == 'GET':
        return HttpResponse(slot_value)




@login_required(login_url="/login")
def admin_page(request):
    return render(request, "../templates/admin_signin/darkpan/index.html", {'username': username})

def sign_in(request):
    global username
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('admin_page')
        else:
            messages.success(request, ("Ви десь припустили помилку, спробуйте ще раз!"))
            return redirect('login')
    else:
        return render(request, "../templates/admin_signin/darkpan/signin.html", {})
    

def generate_url(request):
    if request.method == "GET":
        onetime_url = uuid.uuid4()
        OneTimeLinkModel.objects.create(onetime_url=onetime_url)
        print(str(onetime_url))
        return HttpResponse(str(onetime_url))