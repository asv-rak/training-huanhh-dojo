define(["doh/runner", "../store/GreetingStore", "http://sinonjs.org/releases/sinon-1.17.2.js"], function(doh, GreetingStore){

	doh.register("sinon.js", [
		{
			name: "server",
			setUp: function(){
				this.server = sinon.fakeServer.create();
				this.server.respondWith("GET", "/api/guestbook/new_book/greeting/",
					[200, {"Content-Type": "application/json"},
						'[{ "guestbook_name": "new_book", "guestbook_mesage": "Unit test" }]']);
			},
			runTest: function(){
				var callback = sinon.spy();
				var greetingStore = new GreetingStore("new_book", "Unit test", null);
				greetingStore.addGuestbook().then(function () { callback = 1 });

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
