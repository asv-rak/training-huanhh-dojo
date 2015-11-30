import json
from django.http import HttpResponse, QueryDict
from django.views.generic.edit import FormView
from guestbook.models import Greeting, Guestbook
from guestbook.forms import SignForm, EditForm

class JSONResponseMixin(object):
	def render_to_response(self, context):
		return self.get_json_response(self.convert_context_to_json(context))

	@staticmethod
	def get_json_response(content, **http_response_kwargs):
		return HttpResponse(content, content_type='application/json', **http_response_kwargs)

	@staticmethod
	def convert_context_to_json(context):
		return json.dumps(context)


class GetListView(JSONResponseMixin, FormView):

	form_class = SignForm
	def get(self, request, *args, **kwargs):
		guestbook_name = self.request.GET.get('guestbook_name',Guestbook.get_default_guestbook())
		url_safe = self.request.GET.get('cursor')
		greetings, next_cursor, is_more = Greeting.get_greeting_with_cursor(
			url_safe=url_safe,
			guestbook_name=guestbook_name,
		)
		data = {
			"guestbook_name": guestbook_name,
			"greetings": greetings,
			"more": is_more,
			"next_cursor": str(next_cursor.urlsafe()) if is_more else None
		}
		return self.render_to_response(data)


	def post(self, request, *args, **kwargs):
		try:
			json_object = json.loads(self.request.body)

		except ValueError:
			self.request.POST = QueryDict(self.request.body)
		else:
			self.request.POST = json_object
		form_class = self.get_form_class()
		form = self.get_form(form_class)
		if form.is_valid():
			return self.form_valid(form)
		else:
			return self.form_invalid(form)

	def form_invalid(self, form):
		return HttpResponse(status=400)

	def form_valid(self, form):
		guestbook_name = form.cleaned_data['guestbook_name']
		content = form.cleaned_data['guestbook_mesage']
		new_greeting_key = Greeting.add_greeting(content, guestbook_name)
		if new_greeting_key:
			return HttpResponse(status=204)
		else:
			return HttpResponse(status=404)


class ResourceSingle(JSONResponseMixin, FormView):

	form_class = EditForm

	def get(self, request, *args, **kwargs):
		guestbook_name = kwargs.get('guestbook_name',Guestbook.get_default_guestbook())
		greeting_id = kwargs.get('id', None)
		greeting = Greeting.get_greeting(guestbook_name, greeting_id)
		if not greeting:
			return HttpResponse(status=404)
		context = Greeting.to_dict( greeting, guestbook_name)
		return self.render_to_response(context)

	def put(self, request, *args, **kwargs):

		try:
			json_object = json.loads(self.request.body)
		except ValueError:
			self.request.POST = QueryDict(self.request.body)
		else:
			self.request.POST = json_object
		form_class = self.get_form_class()
		form = self.get_form(form_class)
		if form.is_valid():
			return self.form_valid(form)
		else:
			return self.form_invalid(form)


	def form_invalid(self, form):
		return HttpResponse(status=400)

	def form_valid(self, form):

		guestbook_name = form.cleaned_data['guestbook_name']
		greeting_id = form.cleaned_data['greeting_id']
		content = form.cleaned_data['guestbook_mesage']
		update_greeting_key = Greeting.update_greeting(content, guestbook_name, greeting_id)
		if update_greeting_key:
			return HttpResponse(status=204)
		else:
			return HttpResponse(status=404)

	def delete(self, *args, **kwargs):
		guestbook_name = kwargs.get('guestbook_name',Guestbook.get_default_guestbook())
		greeting_id = kwargs.get('id', None)
		detete_greeting_key = Greeting.delete_greeting(guestbook_name, greeting_id)
		if detete_greeting_key is True:
			return HttpResponse(status=204)
		else:
			return HttpResponse(status=404)