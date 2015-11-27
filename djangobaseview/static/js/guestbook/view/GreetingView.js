define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/on",
	"dojo/dom-style",
	"dojo/topic",
	"dojo/text!../templates/GreetingView.html",
	"./_ViewBaseMixin",
	"../store/GreetingStore"
], function (declare, lang, dom, on, domStyle, topic, template, _ViewBaseMixin, GreetingStore) {

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

		_deleteGreeting: function () {
			var confirm = window.confirm("Do you want delete " + this.guestbookName);
			var destroyGreeting = lang.hitch(this, this.destroy());

			if (confirm == true) {
				var store = new GreetingStore(this.guestbookName, this.content, this.greetingId);

				store.deleteGreeting().then(function() {
					destroyGreeting;
				});
			}else {
				return false;
			}
		},

		_editGreeting: function () {
			domStyle.set(this.formEditGreeting, "display", "block");
		},

		_cancelEdit: function () {
			domStyle.set(this.formEditGreeting, "display", "none");
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
				})
			)
		}
	});

});