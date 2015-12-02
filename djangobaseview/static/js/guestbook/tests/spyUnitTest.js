define([
	"doh/runner",
	"./sinon-1.17.2.js"
], function (doh, sinon) {
	//var callback = sinon.spy();
	//var proxy = once(callback);
	//
	//proxy();
	//
	//assert(callback.called);
	doh.register("MyTests", [
		function assertTrueTest(){
			doh.assertTrue(true);
			doh.assertTrue(1);
			doh.assertTrue(!false);
		},
		{
			name: "thingerTest",
			setUp: function(){
				this.thingerToTest = new Thinger();
				this.thingerToTest.doStuffToInit();
			},
			runTest: function(){
				doh.assertEqual("blah", this.thingerToTest.blahProp);
				doh.assertFalse(this.thingerToTest.falseProp);
				// ...
			},
			tearDown: function(){
			}
		}])
	// ...
});