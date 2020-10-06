from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView
from django.contrib.auth.mixins import LoginRequiredMixin

from django.contrib.auth.models import User
from django.forms.models import model_to_dict

from .forms import UserCreateForm, ProfileForm
from .models import UserProfile



class ProfileCreateView(LoginRequiredMixin, FormView):
    login_url = "/user/login/"
    model = UserProfile
    form_class = ProfileForm
    template_name = "user/create_profile.html"
    success_url = "/user/account/"

    def get_initial(self):
        try:
            profile = UserProfile.objects.get(user=self.request.user)
            profile = model_to_dict(profile)
        except UserProfile.DoesNotExist:
            profile = {}
        
        return profile

    def form_valid(self, form):
        profile = form.save(commit=False)
        profile.user = self.request.user
        print('Valid')

        profile.save()
        return redirect(self.success_url)
    
    def form_invalid(self, form):
        print(form.errors)
        return HttpResponse("Invalid data")


class UserCreateView(FormView):
    model = User
    template_name = "user/register.html"
    form_class= UserCreateForm
    success_url = "/user/login/"

    def form_valid(self, form):
        form.save()
        return redirect(self.success_url)


class ProfileView(LoginRequiredMixin, TemplateView):
    login_url = '/user/login/' 
    template_name = "user/user_profile.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        try:
            context["profile"] = UserProfile.objects.get(user = self.request.user)
        except UserProfile.DoesNotExist:
            context["profile"] = {}
        
        print(context['profile'])
        return context
    


