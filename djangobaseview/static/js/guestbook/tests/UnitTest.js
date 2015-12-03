define([
	"dojo/json",
	"doh/runner",
	"/static/js/sinon/sinon.js",
	"../store/GreetingStore"
], function(JSON, doh, sinon, GreetingStore) {

	doh.register("GreetingStore", [
		{
			name: "Add guest book",
			setUp: function() {
				var fakeSuccessData = [{ "guestbook_name": "new_book"}, {"guestbook_message": "Unit test"}];
				this.server = sinon.fakeServer.create();
				this.server.respondWith("POST", "/api/guestbook/new_book/greeting/",
					[204, {"Content-Type": "application/json"}, JSON.stringify(fakeSuccessData)]);
			},
			runTest: function() {
				var dohDeferred = new doh.Deferred();

				var greetingStore = new GreetingStore();
				greetingStore.addGuestbook("new_book", "Unit test").then(dohDeferred.getTestCallback(function (result) {
					doh.assertEqual(JSON.stringify([{ "guestbook_name": "new_book"}, {"guestbook_message": "Unit test"}]), result);
				}), dohDeferred.getTestCallback(function (error) {
					console.log(error);
				}));
				this.server.respond();

				return dohDeferred;
			},
			tearDown: function() {
				this.server.restore();
			}
		},
		{
			name: "Load guest book",
			setUp: function() {
				var fakeSuccessData = { "guestbook_name": "new_book"};
				this.server = sinon.fakeServer.create();
				this.server.respondWith("GET", "/api/guestbook/new_book/greeting/",
					[204, {"Content-Type": "application/json"}, JSON.stringify(fakeSuccessData)]);
			},
			runTest: function() {
				var dohDeferred = new doh.Deferred();
				var greetingStore = new GreetingStore();
				greetingStore.getGreetings('new_book').then(dohDeferred.getTestCallback(function (result) {
					doh.assertEqual(JSON.stringify({ "guestbook_name": "new_book"}), result);
				}), dohDeferred.getTestCallback(function (error) {
					console.log(error);
				}));
				this.server.respond();

				return dohDeferred;
			},
			tearDown: function() {
				this.server.restore();
			}
		},
		{
			name: "Delete greeting",
			setUp: function() {
				var fakeSuccessData = [{ "guestbook_name": "new_book"}, {"guestbook_message": "Unit test"}, {"greeting_id": 1234567}];
				this.server = sinon.fakeServer.create();
				this.server.respondWith("DELETE", "/api/guestbook/new_book/greeting/1234567",
					[204, {"Content-Type": "application/json"}, JSON.stringify(fakeSuccessData)]);
			},
			runTest: function() {
				var dohDeferred = new doh.Deferred();
				var greetingStore = new GreetingStore();
				greetingStore.deleteGreeting("new_book", 1234567).then(dohDeferred.getTestCallback(function (result) {
					doh.assertEqual(JSON.stringify([{ "guestbook_name": "new_book"}, {"guestbook_message": "Unit test"}, {"greeting_id": 1234567}]), result);
				}), dohDeferred.getTestCallback(function (error) {
					console.log(error);
				}));
				this.server.respond();

				return dohDeferred;
			},
			tearDown: function() {
				this.server.restore();
			}
		},
		{
			name: "Add message over 10 character",
			setUp: function() {
				var fakeSuccessData = [{ "guestbook_name": "new_book"}, {"guestbook_message": "12345678 91011121314151617181920 21 22"}];
				this.server = sinon.fakeServer.create();
				this.server.respondWith("POST", "/api/guestbook/new_book/greeting/",
					[400, {"Content-Type": "application/json"}, JSON.stringify(fakeSuccessData)]);
			},
			runTest: function() {
				var dohDeferred = new doh.Deferred();
				var greetingStore = new GreetingStore();
				greetingStore.addGuestbook("new_book", "12345678 91011121314151617181920 21 22").then(dohDeferred.getTestCallback(function (result) {
					doh.assertEqual(JSON.stringify([{ "guestbook_name": "new_book"}, {"guestbook_message": "12345678 91011121314151617181920 21 22"}]), result);
				}), dohDeferred.getTestCallback(function (error) {
					doh.assertEqual(400, error.response.status);
				}));
				this.server.respond();

				return dohDeferred;
			},
			tearDown: function() {
				this.server.restore();
			}
		},
		// ...
	]);

});
