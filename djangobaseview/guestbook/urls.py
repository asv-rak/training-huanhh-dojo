from django.conf.urls import patterns,url, include
from guestbook.views import IndexView, SignView, DeleteView, SendmailView, EditView, DojoGuestbook

urlpatterns = patterns('',
	url(r'^$', IndexView.as_view()),
	url(r'^sign/$', SignView.as_view()),
	url(r'^edit/$', EditView.as_view()),
	url(r'^delete/$', DeleteView.as_view()),
	url(r'^sendmail/$', SendmailView.as_view()),
	url(r'^api/', include('guestbook.api.urls')),
	url(r'^dojo/$', DojoGuestbook.as_view()),
)