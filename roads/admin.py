from django.contrib.gis import admin 
from .models import RoadReport, Road, Wards, Municipality, RoadCondition, Roads, Development, Bridges

# Register your models here.
@admin.register(Roads)
class RoadsAdmin(admin.GeoModelAdmin):
    search_fields = ["name"]
    list_display = ["name", "road_class", "road_no"]
    list_filter = ["road_class", "surface"]

@admin.register(RoadCondition)
class RoadConditionAdmin(admin.GeoModelAdmin):
    search_fields = ["name"]
    list_display = ["name"]
    list_filter = ["rd_condtn"]

@admin.register(Development)
class DevelopmentAdmin(admin.GeoModelAdmin):
    search_fields = ["contractor"]
    list_display = ["prj_name",  "road_no"]
    list_filter = ["status", "maint_type"]

@admin.register(Bridges)
class BridgesAdmin(admin.GeoModelAdmin):
    search_fields = ["name"]
    list_display = ["road_no", "bridge_typ"]
    list_filter = ["stuct_typ", "bridge_typ", "sbstruct_c"]

@admin.register(Road)
class RoadAdmin(admin.GeoModelAdmin):
    search_fields = ["name", "material", "contractor", "road_struc"]
    list_display = ["name", "contractor", "maintenanc", "constructi"]
    list_filter = ["contractor", "material", "road_struc"]

def mark_as_resolved(modeladmin, request, queryset):
    queryset.update(is_resolved=True)

mark_as_resolved.short_description = "Mark as resolved"

@admin.register(RoadReport)
class RoadReportAdmin(admin.GeoModelAdmin):
    search_fields = ["title", "description"]
    list_display = ["title", "date"]
    list_filter = ["is_resolved", "report_type"]
    actions = [mark_as_resolved]