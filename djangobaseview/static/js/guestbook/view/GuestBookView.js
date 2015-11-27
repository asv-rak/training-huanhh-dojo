define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom",
	"dojo/on",
	"dojo/dom-construct",
	"dojo/topic",
	"dojo/request",
	"dojo/cookie",
	"dojo/text!../templates/GuestBookView.html",
	"./_ViewBaseMixin",
	"../store/GreetingStore",
	"../view/GreetingView",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/Textarea",
	"dijit/form/Button"
], function (declare, array, dom, on, domConstruct, topic, request, cookie, template,
             _ViewBaseMixin, GreetingStore, GreetingView) {
	return declare("guestbook.view.GuestBookView", [_ViewBaseMixin], {
		templateString: template,

		loadGreetings: function (guestbookName) {
			var store = new GreetingStore(guestbookName, null, null);
			store.getGreetings().then(function(data) {
				var list = JSON.parse(data).greetings;
				var listContainer = dom.byId('listGuestbookContainer');

				domConstruct.empty(listContainer);

				var _newDocFrag = document.createDocumentFragment();
				array.forEach(list, function (guestbook) {
					var greetingView = new GreetingView(guestbook);

					greetingView.startup();
					domConstruct.place(greetingView.domNode, _newDocFrag);
				});
				domConstruct.place(_newDocFrag, listContainer);
			});
		},

		postCreate: function () {
			this.inherited(arguments);

			var guestbookView = this;

			guestbookView.loadGreetings("default_guestbook");

			var guestbookNameNode = this.guestbookNameNode;
			var guestbookMessageNode = this.guestbookMessageNode;
			var form = this.signForm;

			// add guestbook api
			this.own(
				on(form, "submit", function (e) {
					e.preventDefault();
					var guestbookName = guestbookNameNode.value;
					var guestbookMessage = guestbookMessageNode.value;
					var store = new GreetingStore(guestbookName, guestbookMessage, null);

					store.addGuestbook().then(function() {
						guestbookView.loadGreetings(guestbookName);
					});
				})
			);

			var handle = topic.subscribe("update/topic", function(e){
				guestbookView.loadGreetings(e.param);
				//handle.remove();
			});
		}
	});

});