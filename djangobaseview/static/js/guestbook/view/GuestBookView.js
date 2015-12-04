define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
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
	// Read only
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/Textarea",
	"dijit/form/Button"
], function (declare, array, lang, dom, on, domConstruct, topic, request, cookie, template,
             _ViewBaseMixin, GreetingStore, GreetingView) {

	return declare("guestbook.view.GuestBookView", [_ViewBaseMixin], {
		templateString: template,

		initGreetingStore: function() {
			this.greetingStore = new GreetingStore();
		},

		loadGreetings: function (guestbookName) {
			this.greetingStore.getGreetings(guestbookName).then(function(data) {
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
			this.initGreetingStore();
			this.loadGreetings("default_guestbook");

			// add guestbook api
			this.own(
				on(this.signForm, "submit", lang.hitch(this, function (e) {
					e.preventDefault();

					this.greetingStore.addGuestbook(this.guestbookNameNode.value, this.guestbookMessageNode.value).then(lang.hitch(this, function() {
							this.loadGreetings(this.guestbookNameNode.value);
						}),
						function (status) {
							alert(status.message);
						});
				})),

				on(this.switchForm, "submit", lang.hitch(this, function (e) {
					e.preventDefault();
					this.loadGreetings(this.guestbookNameSwitch.value);
				})),

				topic.subscribe("guestbook/view/GreetingView/update", lang.hitch(this, function(e){
					this.loadGreetings(e.param);
				}))
			);
		}
	});

});