from django.db import models

class OneTimeLinkModel(models.Model):
    onetime_url = models.CharField(max_length=36)

class Game_Settings(models.Model):
    prize_name = models.CharField(max_length=64, unique=True)


class Counter(models.Model):
    count_of_games = models.IntegerField(default=0)
    count_of_wins = models.IntegerField(default=0)


class WinDiscription(models.Model):
    for_game = models.CharField(max_length=64, unique=True)
    prize_name = models.CharField(max_length=200, default=' ')
    promocode = models.CharField(max_length=200, default=' ')
    company = models.CharField(max_length=200, default=' ')
    link = models.CharField(max_length=200, default=' ')


class LobbyDiscription(models.Model):
    for_game = models.CharField(max_length=64, unique=True)
    title = models.CharField(max_length=200, default=' ')
    prize_name = models.CharField(max_length=200, default=' ')
    company = models.CharField(max_length=200, default=' ')
    link = models.CharField(max_length=200, default=' ')
