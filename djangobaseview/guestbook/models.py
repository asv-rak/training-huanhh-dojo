import datetime
import logging
import array
from google.appengine.api import users
from google.appengine.ext import ndb
from google.appengine.api import memcache
from google.appengine.ext.ndb import Cursor

DEFAULT_GUESTBOOK_NAME = 'default_guestbook'


# We set a parent key on the 'Greetings' to ensure that they are all in the same
# entity group. Queries across the single entity group will be consistent.
# However, the write rate should be limited to ~1/second.



class Greeting(ndb.Model):
	'''Models an individual Guestbook entry.'''
	author = ndb.UserProperty()
	content = ndb.StringProperty(indexed=False)
	date = ndb.DateTimeProperty(auto_now_add=True)
	update_date = ndb.DateTimeProperty(auto_now_add=True)


	@classmethod
	def get_latest(cls, guestbook_name, count):
		greetings = memcache.get('{}:greetings'.format(guestbook_name))
		if greetings is None:
			greetings_query = cls.query(ancestor=Guestbook.get_key_guestbook(guestbook_name)).order(-cls.date)
			greetings = greetings_query.fetch(count)
			if not memcache.add('{}:greetings'.format(guestbook_name),greetings,10):
				logging.error('Memcache set failed')
		return greetings

	@classmethod
	def add_greeting(cls, content, guestbook_name):
		greeting = cls(parent=Guestbook.get_key_guestbook(guestbook_name))
		if users.get_current_user():
			greeting.author = users.get_current_user()
		greeting.content = content
		try:
			new_greeting_key = greeting.put()
		except Exception as e:
			print '%s (%s)' % (e.message, type( e ))
		memcache.flush_all()
		return new_greeting_key

	@classmethod
	def update_greeting(cls, content, guestbook_name, greeting_id):
		greeting_key = cls.get_key_by_id(guestbook_name,greeting_id)
		greeting = greeting_key.get()
		greeting.content = content
		greeting.update_date = datetime.datetime.now()
		try:
			update_greeting_key = greeting.put()
		except Exception as e:
			print '%s (%s)' % (e.message, type( e ))
		memcache.flush_all()
		return update_greeting_key

	@classmethod
	def get_greeting(cls, guestbook_name, greeting_id):
		greeting_key = cls.get_key_by_id(guestbook_name,greeting_id)
		greeting = greeting_key.get()
		return greeting

	@classmethod
	def get_key_by_id(cls, guestbook_name, greeting_id):
		try:
			greeting_id = int(greeting_id)
		except ValueError:
			raise ValueError("Greeting ID must be a positive integer. Please try again!")

		return ndb.Key(cls, greeting_id, parent=Guestbook.get_key_guestbook(guestbook_name))

	@classmethod
	def delete_greeting(cls, guestbook_name, greeting_id):
		greeting_key = cls.get_key_by_id(guestbook_name,greeting_id)
		delete_greeting = greeting_key.delete()
		memcache.flush_all()
		return delete_greeting

	@classmethod
	def get_greeting_with_cursor(cls, url_safe, guestbook_name, count=20):
		start_cursor = Cursor(urlsafe=url_safe)
		greetings, next_cursor, is_more = cls.query(ancestor=Guestbook.get_key_guestbook(guestbook_name)).order(-cls.date).fetch_page(count, start_cursor=start_cursor)
		return greetings, next_cursor, is_more


	@classmethod
	def greeting_to_dict(cls, url_safe, guestbook_name, count=20):
		greetings, next_cursor, is_more = cls.get_greeting_with_cursor(url_safe,guestbook_name,count)
		greeting_json = []
		for greeting in greetings:
			greeting_json.append(cls.to_dict(greeting, guestbook_name))
		return greeting_json, next_cursor, is_more


	@classmethod
	def to_dict(cls, greeting, guestbook_name):
		data = {
			"greeting_id": greeting.key.id(),
			"content": greeting.content,
			"date": str(greeting.date),
			"updated_by": str(greeting.author),
			"updated_date": str(greeting.update_date),
			"guestbook_name": guestbook_name,
		}
		return data;


class Guestbook(ndb.Model):

	@classmethod
	def get_default_guestbook(cls):
		return 'default_guestbook'

	@classmethod
	def get_key_guestbook(cls, guestbook_name):
		if not guestbook_name:
			guestbook_name = cls.get_default_guestbook()
		return ndb.Key('Guestbook', guestbook_name)

