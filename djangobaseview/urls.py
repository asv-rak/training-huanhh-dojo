from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
	url(r'^', include('guestbook.urls')),
	# url(r'^api/', include('api.urls')),
	# url(r'^dojo/', include('dojo.urls')),
)
