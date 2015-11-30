define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/on",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/topic",
	"dojo/text!../templates/GreetingView.html",
	"./_ViewBaseMixin",
	"../store/GreetingStore",
	// Read only
	"dijit/form/Button"
], function (declare, lang, dom, on, domConstructor, domStyle, domAttr, topic, template,
             _ViewBaseMixin, GreetingStore, Button) {

	return declare("guestbook.view.GreetingView", [_ViewBaseMixin], {
		templateString: template,

		constructor: function(guestbook) {
			this.greetingId = guestbook.greeting_id;
			this.createDate = guestbook.date;
			this.guestbookName = guestbook.guestbook_name;
			this.content = guestbook.content;
			this.updatedBy = guestbook.updated_by;
			this.updatedDate = guestbook.updated_date;
		},

		postCreate: function () {
			this.inherited(arguments);

			var guestbookNameNode = this.editGuestbookName;
			var guestbookMessageNode = this.editGuestbookContent;
			var greetingIdNode = this.editGreetingId;
			var buttonEdit = this.editGreeting;
			var formEdit = this.formEditGreeting;
			var buttonCancelEdit = this.cancelEdit;

			if (dom.byId('role').value.toLowerCase() !== 'true') {
				if (dom.byId('username').value == this.updatedBy) {
					domConstructor.destroy(this.deleteGreeting);
				} else {
					domConstructor.destroy(this.deleteGreeting);
					domConstructor.destroy(this.editGreeting);
					domConstructor.destroy(this.formEditGreeting);
				}
			}

			this.own(
				on(this.formEditGreeting, 'submit', lang.hitch(this, function (e) {
					e.preventDefault();
					var guestbookMessage = guestbookMessageNode.value;

					var store = new GreetingStore(this.guestbookName, guestbookMessage, this.greetingId);

					store.updateGreeting().then(lang.hitch(this, function () {
						topic.publish('guestbook/view/GreetingView/update', { param: this.guestbookName });
					}));
				})),

				on(this.deleteGreeting, 'click', lang.hitch(this, function () {
					var confirm = window.confirm("Do you want delete " + this.guestbookName);

					if (confirm == true) {
						var store = new GreetingStore(this.guestbookName, null, this.greetingId);
						store.deleteGreeting().then(lang.hitch(this, function () {
							this.destroy();
						}));
					}else {
						return false;
					}
				})),

				on(this.editGreeting, 'click', lang.hitch(this, function () {
					domStyle.set(this.formEditGreeting, "display", "block");
				})),

				on(this.cancelEdit, 'click', lang.hitch(this, function () {
					domStyle.set(this.formEditGreeting, "display", "none");
				}))
			)
		}
	});

});