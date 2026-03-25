from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser


class SignupForm(UserCreationForm):
    first_name = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'First Name'
        })
    )
    last_name = forms.CharField(
        max_length=50,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Last Name (optional)'
        })
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email Address'
        })
    )
    username = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Username'
        })
    )
    phone = forms.CharField(
        max_length=15,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Phone (optional)'
        })
    )
    location = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Location / District (optional)'
        })
    )
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Password'
        })
    )
    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirm Password'
        })
    )

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email', 'phone', 'location', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.phone = self.cleaned_data.get('phone', '')
        user.location = self.cleaned_data.get('location', '')
        if commit:
            user.save()
        return user


class LoginForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Username'
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Password'
        })
    )


class ProfileUpdateForm(forms.ModelForm):
    first_name = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    last_name = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )
    phone = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    location = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'phone', 'location']


class PredictionForm(forms.Form):
    nitrogen = forms.FloatField(
        label='Nitrogen (N)',
        min_value=0, max_value=200,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. 90',
            'step': '0.01'
        })
    )
    phosphorus = forms.FloatField(
        label='Phosphorus (P)',
        min_value=0, max_value=200,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. 42',
            'step': '0.01'
        })
    )
    potassium = forms.FloatField(
        label='Potassium (K)',
        min_value=0, max_value=300,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. 43',
            'step': '0.01'
        })
    )
    temperature = forms.FloatField(
        label='Temperature (°C)',
        min_value=0, max_value=60,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. 20.8',
            'step': '0.01'
        })
    )
    humidity = forms.FloatField(
        label='Humidity (%)',
        min_value=0, max_value=100,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. 82',
            'step': '0.01'
        })
    )
    ph = forms.FloatField(
        label='pH Value',
        min_value=0, max_value=14,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. 6.5',
            'step': '0.01'
        })
    )
    rainfall = forms.FloatField(
        label='Rainfall (mm)',
        min_value=0, max_value=500,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. 202',
            'step': '0.01'
        })
    )
