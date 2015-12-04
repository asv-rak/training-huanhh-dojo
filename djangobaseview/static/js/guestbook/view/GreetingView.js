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
	"../store/GreetingStore"
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
			this.isAdmin = guestbook.is_admin;
			this.updatedDate = guestbook.updated_date;
		},

		postCreate: function () {
			this.inherited(arguments);

			if (!this.isAdmin) {
				if (dom.byId('username').value == this.updatedBy && dom.byId('username').value != '') {
					domConstructor.destroy(this.deleteGreeting);
				} else {
					domConstructor.destroy(this.deleteGreeting);
					domConstructor.destroy(this.editGreeting);
					domConstructor.destroy(this.formEditGreeting);
				}
			}

			var store = new GreetingStore();
			this.own(
				on(this.formEditGreeting, 'submit', lang.hitch(this, function (e) {
					e.preventDefault();

					store.updateGreeting(this.guestbookName, this.editGuestbookContent.value, this.greetingId)
						.then(lang.hitch(this, function () {
							topic.publish('guestbook/view/GreetingView/update', { param: this.guestbookName });
						}),
						function (status) {
							alert(status.message);
						});
				})),

				on(this.deleteGreeting, 'click', lang.hitch(this, function () {
					var confirm = window.confirm("Do you want delete " + this.guestbookName);

					if (confirm == true) {
						store.deleteGreeting(this.guestbookName, this.greetingId).then(lang.hitch(this, function () {
								this.destroy();
							}),
							function (status) {
								alert(status.message);
							});
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