from django.contrib.gis.db import models


class Municipality(models.Model):
    fid = models.IntegerField(primary_key=True)
    geom = models.PolygonField(blank=True, null=True)  # This field type is a guess.
    constituen = models.CharField(max_length=254, blank=True, null=True)
    county_nam = models.CharField(max_length=254, blank=True, null=True)
    area = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'municipality'


class Road(models.Model):
    objectid = models.BigIntegerField(primary_key=True)
    geom = models.LineStringField(blank=True, null=True)  # This field type is a guess.
    fid_field = models.BigIntegerField(db_column='fid_', blank=True, null=True)  # Field renamed because it ended with '_'.
    full_id = models.TextField(blank=True, null=True)
    osm_id = models.TextField(blank=True, null=True)
    osm_type = models.TextField(blank=True, null=True)
    highway = models.TextField(blank=True, null=True)
    lanes = models.TextField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    surface = models.TextField(blank=True, null=True)
    oneway = models.TextField(blank=True, null=True)
    junction = models.TextField(blank=True, null=True)
    bridge = models.TextField(blank=True, null=True)
    layer = models.TextField(blank=True, null=True)
    access = models.TextField(blank=True, null=True)
    descriptio = models.TextField(blank=True, null=True)
    maxspeed = models.TextField(blank=True, null=True)
    shape_leng = models.FloatField(blank=True, null=True)
    maintenanc = models.TextField(blank=True, null=True)
    constructi = models.TextField(blank=True, null=True)
    road_struc = models.TextField(blank=True, null=True)
    width = models.FloatField(blank=True, null=True)
    standard_s = models.TextField(blank=True, null=True)
    start_poin = models.FloatField(blank=True, null=True)
    endpoint = models.FloatField(blank=True, null=True)
    material = models.TextField(blank=True, null=True)
    contract_p = models.DateField(blank=True, null=True)
    contractor = models.TextField(blank=True, null=True)
    authority = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'road'



class Wards(models.Model):
    objectid = models.FloatField(primary_key=True)
    geom = models.PolygonField(blank=True, null=True)  # This field type is a guess.
    const_nam = models.CharField(max_length=50, blank=True, null=True)
    elec_area_field = models.CharField(db_column='elec_area_', max_length=50, blank=True, null=True)  # Field renamed because it ended with '_'.
    local_auth = models.CharField(max_length=50, blank=True, null=True)
    const_no = models.FloatField(blank=True, null=True)
    county_nam = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wards'
