from django.contrib import admin
from django import forms
from django.forms import CheckboxSelectMultiple

from .models import Activity, Application


class ApplicationAdminForm(forms.ModelForm):
	activities = forms.ModelMultipleChoiceField(
		queryset=Activity.objects.all(),
		required=False,
		widget=CheckboxSelectMultiple,
	)

	class Meta:
		model = Application
		fields = '__all__'


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
	search_fields = ('name',)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
	form = ApplicationAdminForm
	list_display = ('applicant_name', 'grade_level', 'gender', 'status', 'created_at')
	list_filter = ('grade_level', 'gender', 'status')
	search_fields = ('applicant_name',)
