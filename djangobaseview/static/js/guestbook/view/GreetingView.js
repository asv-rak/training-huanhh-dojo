define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/on",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/topic",
	"dojo/text!../templates/GreetingView.html",
	"./_ViewBaseMixin",
	"../store/GreetingStore"
], function (declare, lang, dom, on, domStyle, domAttr, topic, template, _ViewBaseMixin, GreetingStore) {

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

			var isAdmin = dom.byId('role').value;
			var username = dom.byId('username').value;

			if (isAdmin.toLowerCase() !== 'true' && username !== this.updatedBy) {
				domStyle.set(this.deleteGreeting, "display", "none");
				domStyle.set(this.editGreeting, "display", "none");
			}

			var guestbookNameNode = this.editGuestbookName;
			var guestbookMessageNode = this.editGuestbookContent;
			var greetingIdNode = this.editGreetingId;
			var buttonDelete = this.deleteGreeting;
			var buttonEdit = this.editGreeting;
			var formEdit = this.formEditGreeting;
			var buttonCancelEdit = this.cancelEdit;

			this.own(
				on(this.formEditGreeting, 'submit', function (e) {
					e.preventDefault();
					var guestbookName = guestbookNameNode.value;
					var guestbookMessage = guestbookMessageNode.value;
					var greetingId = greetingIdNode.value;

					var store = new GreetingStore(guestbookName, guestbookMessage, greetingId);

					store.updateGreeting().then(function () {
						topic.publish('update/topic', { param: guestbookName });
					});
				}),

				on(buttonDelete, 'click', function (e) {
					var greetingId = domAttr.get(buttonDelete, "data-value");
					var guestbookName = domAttr.get(buttonDelete, "data-name");

					var confirm = window.confirm("Do you want delete " + guestbookName);

					if (confirm == true) {
						var store = new GreetingStore(guestbookName, null, greetingId);

						store.deleteGreeting().then(function() {
							lang.hitch(this, function () {
								this.destroy();
							});
						});
					}else {
						return false;
					}
				}),

				on(buttonEdit, 'click', function () {
					domStyle.set(formEdit, "display", "block");
				}),

				on(buttonCancelEdit, 'click', function () {
					domStyle.set(formEdit, "display", "none");
				})
			)
		}
	});

});