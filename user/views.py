from django.shortcuts import render, redirect
from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView
from django.contrib.auth.mixins import LoginRequiredMixin

from django.contrib.auth.models import User
from .forms import UserCreateForm, ProfileForm
from .models import UserProfile

class ProfileCreateView(LoginRequiredMixin, FormView):
    model = UserProfile
    form_class = ProfileForm
    template_name = "user/create_profile.html"
    success_url = "/user/profile/"

    def form_valid(self, form):
        profile = form.save(commit = False)
        profile.user = self.request.user
        return redirect(self.success_url)


class UserCreateView(FormView):
    model = User
    template_name = "user/register.html"
    form_class= UserCreateForm
    success_url = "/user/login/"

    def form_valid(self, form):
        form.save()
        return redirect(self.success_url)


class ProfileView(LoginRequiredMixin, TemplateView):
    template_name = "user/user_profile.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context["profile"] = UserProfile.objects.filter(user = self.request.user)
        return context
    


