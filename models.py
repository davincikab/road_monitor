# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.gis.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Bridges(models.Model):
    id = models.BigIntegerField(primary_key=True)
    geom = models.PointField(blank=True, null=True)
    road_no = models.CharField(max_length=80, blank=True, null=True)
    bridge_typ = models.CharField(max_length=80, blank=True, null=True)
    cross_typ = models.CharField(max_length=80, blank=True, null=True)
    spstruct_m = models.CharField(max_length=80, blank=True, null=True)
    spstruct_c = models.CharField(max_length=80, blank=True, null=True)
    sbstruct_m = models.CharField(max_length=80, blank=True, null=True)
    deck_c = models.CharField(max_length=80, blank=True, null=True)
    stuct_typ = models.CharField(max_length=80, blank=True, null=True)
    sbstruct_c = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'bridges'


class Constituencies(models.Model):
    geom = models.MultiPolygonField(blank=True, null=True)
    objectid = models.FloatField(blank=True, null=True)
    st_area_sh = models.FloatField(blank=True, null=True)
    constituen = models.CharField(max_length=-1, blank=True, null=True)
    county = models.CharField(max_length=-1, blank=True, null=True)
    population = models.FloatField(blank=True, null=True)
    populati_1 = models.IntegerField(blank=True, null=True)
    numberofho = models.CharField(max_length=-1, blank=True, null=True)
    averagehou = models.FloatField(blank=True, null=True)
    area = models.FloatField(blank=True, null=True)
    below18 = models.FloatField(blank=True, null=True)
    household = models.FloatField(blank=True, null=True)
    households = models.CharField(max_length=-1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'constituencies'


class Development(models.Model):
    id = models.BigIntegerField(primary_key=True)
    geom = models.MultiLineStringField(blank=True, null=True)
    road_no = models.CharField(max_length=30, blank=True, null=True)
    contractor = models.CharField(max_length=120, blank=True, null=True)
    prj_name = models.CharField(max_length=120, blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    conct_sum = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    nature_dvp = models.CharField(max_length=120, blank=True, null=True)
    status = models.CharField(max_length=120, blank=True, null=True)
    maint_type = models.CharField(max_length=100, blank=True, null=True)
    funding = models.CharField(max_length=100, blank=True, null=True)
    materials_field = models.CharField(db_column='materials_', max_length=254, blank=True, null=True)  # Field renamed because it ended with '_'.
    developed_field = models.FloatField(db_column='developed_', blank=True, null=True)  # Field renamed because it ended with '_'.

    class Meta:
        managed = False
        db_table = 'development'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class EldoretFootway(models.Model):
    geom = models.MultiLineStringField(blank=True, null=True)
    full_id = models.CharField(max_length=254, blank=True, null=True)
    osm_id = models.CharField(max_length=254, blank=True, null=True)
    osm_type = models.CharField(max_length=254, blank=True, null=True)
    highway = models.CharField(max_length=254, blank=True, null=True)
    bridge = models.CharField(max_length=254, blank=True, null=True)
    access = models.CharField(max_length=254, blank=True, null=True)
    bicycle = models.CharField(max_length=254, blank=True, null=True)
    foot = models.CharField(max_length=254, blank=True, null=True)
    footway = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'eldoret_footway'


class Municipality(models.Model):
    fid = models.IntegerField(primary_key=True)
    geom = models.MultiPolygonField(blank=True, null=True)
    constituen = models.CharField(max_length=254, blank=True, null=True)
    county_nam = models.CharField(max_length=254, blank=True, null=True)
    area = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'municipality'


class Road(models.Model):
    objectid = models.BigIntegerField(primary_key=True)
    geom = models.MultiLineStringField(blank=True, null=True)
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


class RoadCondition(models.Model):
    id = models.BigIntegerField(primary_key=True)
    geom = models.MultiLineStringField(blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    road_no = models.CharField(max_length=30, blank=True, null=True)
    rd_condtn = models.CharField(max_length=100, blank=True, null=True)
    condition_field = models.FloatField(db_column='condition_', blank=True, null=True)  # Field renamed because it ended with '_'.

    class Meta:
        managed = False
        db_table = 'road_condition'


class Roads(models.Model):
    id = models.BigIntegerField(primary_key=True)
    geom = models.MultiLineStringField(blank=True, null=True)
    lanes = models.CharField(max_length=254, blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    surface = models.CharField(max_length=254, blank=True, null=True)
    bridge = models.CharField(max_length=254, blank=True, null=True)
    road_class = models.CharField(max_length=27, blank=True, null=True)
    road_no = models.CharField(max_length=30, blank=True, null=True)
    road_width = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    traffic = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    road_stage = models.CharField(max_length=100, blank=True, null=True)
    authority = models.CharField(max_length=50, blank=True, null=True)
    county = models.CharField(max_length=100, blank=True, null=True)
    road_lengt = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roads'


class RoadsRoadreport(models.Model):
    title = models.CharField(max_length=50)
    slug = models.CharField(max_length=200)
    report_type = models.CharField(max_length=50)
    description = models.TextField()
    geom = models.PointField()
    date = models.DateField()
    image = models.CharField(max_length=100)
    is_resolved = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'roads_roadreport'


class UserUserprofile(models.Model):
    id_number = models.CharField(max_length=13)
    profile_pic = models.CharField(max_length=100)
    employee_status = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    department = models.CharField(max_length=50)
    ward = models.CharField(max_length=50)
    constituency = models.CharField(max_length=50)
    county = models.CharField(max_length=50)
    user = models.OneToOneField(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'user_userprofile'


class Wards(models.Model):
    objectid = models.FloatField(primary_key=True)
    geom = models.MultiPolygonField(blank=True, null=True)
    const_nam = models.CharField(max_length=50, blank=True, null=True)
    elec_area_field = models.CharField(db_column='elec_area_', max_length=50, blank=True, null=True)  # Field renamed because it ended with '_'.
    local_auth = models.CharField(max_length=50, blank=True, null=True)
    const_no = models.FloatField(blank=True, null=True)
    county_nam = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wards'
