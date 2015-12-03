define([
	"doh/runner",
	"/static/js/sinon/sinon.js",
	"../store/GreetingStore"
], function(doh, sinon, GreetingStore){

	doh.register("GreetingStore", [
		{
			name: "Add guest book",
			setUp: function(){
				this.server = sinon.fakeServer.create();
			},
			runTest: function(){
				var callback = sinon.spy();
				this.server.respondWith("GET", "/api/guestbook/new_book/greeting/",
					[200, {"Content-Type": "application/json"},
						'[{ "guestbook_name": "new_book", "guestbook_mesage": "Unit test" }]']);
				var greetingStore = new GreetingStore("new_book", "Unit test", null);
				greetingStore.addGuestbook().then(function () { callback = 1 }, function (status) { console.log(status); });

				this.server.respond();

				doh.assertEqual(callback.callCount, 1);
				//doh.assertTrue(callback.calledWith([{ "guestbook_name": "new_book", "guestbook_mesage": "Unit test" }]));
			},
			tearDown: function(){
				this.server.restore();
			}
		}
		// ...
	]);

});
