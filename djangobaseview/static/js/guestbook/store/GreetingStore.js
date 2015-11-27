define([
	"dojo/_base/declare",
	"dojo/request",
	"dojo/cookie"
], function(declare, request, cookie) {
	return declare(null, {
		constructor: function(guestbookName, guestbookMessage, greetingId) {
			this.greetingId = greetingId;
			this.guestbookName = guestbookName;
			this.guestbookMessage = guestbookMessage;
			this.apiUrl = '/api/guestbook/' + guestbookName + '/greeting/';
			this.headers = {"X-CSRFToken": cookie("csrftoken")};
		},

		addGuestbook: function () {
			return request.post(this.apiUrl, {
				data: {
					guestbook_name: this.guestbookName,
					guestbook_mesage: this.guestbookMessage
				},
				headers: this.headers
			});
		},

		getGreetings: function () {
			return request.get(this.apiUrl, {
				headers: this.headers
			});
		},

		deleteGreeting: function () {
			return request.del(this.apiUrl + this.greetingId, {
				headers: this.headers
			});
		},

		updateGreeting: function () {
			return request.put(this.apiUrl + this.greetingId, {
				data: {
					guestbook_name: this.guestbookName,
					guestbook_mesage: this.guestbookMessage,
					greeting_id: this.greetingId
				},
				headers: this.headers
			});
		}
	});
});