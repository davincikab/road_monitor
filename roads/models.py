from django.contrib.gis.db import models
from django.utils.text import slugify

class Municipality(models.Model):
    fid = models.IntegerField(primary_key=True)
    geom = models.MultiPolygonField(blank=True, null=True)  # This field type is a guess.
    constituen = models.CharField(max_length=254, blank=True, null=True)
    county_nam = models.CharField(max_length=254, blank=True, null=True)
    area = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'municipality'


class Road(models.Model):
    objectid = models.BigIntegerField(primary_key=True)
    geom = models.MultiLineStringField(blank=True, null=True)  # This field type is a guess.
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
    geom = models.MultiPolygonField(blank=True, null=True)  # This field type is a guess.
    const_nam = models.CharField(max_length=50, blank=True, null=True)
    elec_area_field = models.CharField(db_column='elec_area_', max_length=50, blank=True, null=True)  # Field renamed because it ended with '_'.
    local_auth = models.CharField(max_length=50, blank=True, null=True)
    const_no = models.FloatField(blank=True, null=True)
    county_nam = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wards'

class RoadReport(models.Model):
    REPORT_TYPE = (
        ("BP", "Bump"),
        ("RD", "Road Sign"),
        ("PH", "PotHoles"),
        ("DG", "Drainage"),
    )

    title = models.CharField("Title", max_length=50)
    slug = models.SlugField(max_length=200, blank=True)
    report_type = models.CharField("Report Type", choices=REPORT_TYPE, max_length=50)
    description = models.TextField("Description", blank=True)
    geom = models.PointField()
    date = models.DateField("Reported On", auto_now=True)
    image = models.ImageField("Condition Media", upload_to="reports", blank=False)

    class Meta:
        verbose_name = "RoadReport"
        verbose_name_plural = "RoadReports"

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    # def get_absolute_url(self):
    #     return reverse("_detail", kwargs={"pk": self.pk})