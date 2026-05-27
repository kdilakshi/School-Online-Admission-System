from rest_framework import serializers
from .models import Application, Activity


class ApplicationSerializer(serializers.ModelSerializer):
    activities = serializers.SlugRelatedField(read_only=True, many=True, slug_field='name')
    activity_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = Application
        fields = [
            'id',
            'applicant_name',
            'grade_level',
            'gender',
            'activities',
            'activity_names',
            'image',
            'document',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def _assign_activities(self, instance, names):
        instance.activities.clear()
        for name in names:
            activity, _ = Activity.objects.get_or_create(name=name)
            instance.activities.add(activity)

    def create(self, validated_data):
        names = validated_data.pop('activity_names', [])
        application = Application.objects.create(**validated_data)
        if names:
            self._assign_activities(application, names)
        return application

    def update(self, instance, validated_data):
        names = validated_data.pop('activity_names', None)
        # Keep uploaded assets immutable during edits from the dashboard.
        validated_data.pop('image', None)
        validated_data.pop('document', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if names is not None:
            self._assign_activities(instance, names)
        return instance
