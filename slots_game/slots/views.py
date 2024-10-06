from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User, Group
from django.contrib import messages
import uuid, secrets, json
from .models import OneTimeLinkModel, Game_Settings, Counter, WinDiscription, LobbyDiscription


def game_name_validator(game_name):
    prizes = list(Game_Settings.objects.values_list('prize_name', flat=True))
    if game_name in prizes:
        return True
    else:
        return False


def slots_web(request, access_code, game_name):
    prizes = Game_Settings.objects.values_list('prize_name', flat=True)
    data = WinDiscription.objects.values()
    lobby_data = LobbyDiscription.objects.values()
    if game_name_validator(game_name):
        if OneTimeLinkModel.objects.filter(onetime_url=access_code).exists():
            OneTimeLinkModel.objects.filter(onetime_url=access_code).delete()
            for game_headers in data:
                if game_headers['for_game'] == game_name:
                    return render(request, "../templates/slots_template/slots.html", {'prize': game_headers['prize_name'], 'promocode': game_headers['promocode'], 'company': game_headers['company'], 'link': game_headers['link']})
        else:
            return render(request, "../templates/slots_template/lobby.html", {'prizes': list(prizes), 'game_data': json.dumps(list(lobby_data))})
    else:
            return render(request, "../templates/slots_template/lobby.html", {'prizes': list(prizes), 'game_data': json.dumps(list(lobby_data))})
    

def slots_game(request, access_code, game_name):
    slot_value = secrets.randbelow(10)
    if request.method == 'GET':
        return HttpResponse(slot_value)




@login_required(login_url="/login")
def admin_page(request):
    prizes = Game_Settings.objects.values_list('prize_name', flat=True)
    count_wins = Counter.objects.values_list('count_of_wins', flat=True)
    count_games = Counter.objects.values_list('count_of_games', flat=True)
    count_wins = list(count_wins)
    count_games = list(count_games)
    try:
        return render(request, "../templates/admin_signin/darkpan/index.html", {'username': username, 'prizes': list(prizes), 'count_wins': count_wins[-1], 'count_games': count_games[-1]})
    except:
        return redirect('login')

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

def counter_data(request, access_code, game_name):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))['message']
        if data == 'game':
            count_games = Counter.objects.last()
            count_games.count_of_games += 1
            count_games.save()
        elif data == 'win':
            count_wins = Counter.objects.last()
            count_wins.count_of_wins += 1
            count_wins.save()
        return HttpResponse("success")
