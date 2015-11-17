from django.conf.urls import patterns,url
# from api.views import IndexView
from guestbook.api.restful import GetListView,ResourceSingle

urlpatterns = patterns('',
	url(r'^guestbook/(?P<guestbook_name>.+)/greeting/(?P<id>\d+)$', ResourceSingle.as_view()),
	url(r'^guestbook/(?P<guestbook_name>.+)/greeting/$', GetListView.as_view()),

)