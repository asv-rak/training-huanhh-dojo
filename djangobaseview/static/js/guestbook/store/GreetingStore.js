define([
	"dojo/_base/declare",
	"dojo/request",
	"dojo/cookie"
], function(declare, request, cookie) {
	return declare(null, {
		constructor: function() {
			this.headers = {"X-CSRFToken": cookie("csrftoken")};
		},

		createApiUrl: function (guestbookName) {
			return '/api/guestbook/' + guestbookName + '/greeting/';
		},

		addGuestbook: function (guestbookName, guestbookMessage) {
			return request.post(this.createApiUrl(guestbookName), {
				data: {
					guestbook_name: guestbookName,
					guestbook_mesage: guestbookMessage
				},
				headers: this.headers
			});
		},

		getGreetings: function (guestbookName) {
			return request.get(this.createApiUrl(guestbookName), {
				headers: this.headers
			});
		},

		deleteGreeting: function (guestbookName, greetingId) {
			return request.del(this.createApiUrl(guestbookName) + greetingId, {
				headers: this.headers
			});
		},

		updateGreeting: function (guestbookName, guestbookMessage, greetingId) {
			return request.put(this.createApiUrl(guestbookName) + greetingId, {
				data: {
					guestbook_name: guestbookName,
					guestbook_mesage: guestbookMessage,
					greeting_id: greetingId
				},
				headers: this.headers
			});
		}
	});
});