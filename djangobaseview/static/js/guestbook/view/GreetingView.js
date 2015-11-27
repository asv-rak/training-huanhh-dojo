define([
	"dojo/_base/declare",
	"dojo/dom",
	"dojo/on",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/text!../templates/GreetingView.html",
	"./_ViewBaseMixin",
	"../store/GreetingStore"
], function (declare, dom, on, domConstruct, domStyle, template, _ViewBaseMixin, GreetingStore) {

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
			var confirm = window.confirm("Do you want delete " + this.name);
			if(confirm == true) {
				var store = new GreetingStore(this.guestbookName, this.content, this.greetingId);
				var greetingViewId = this.id;
				store.deleteGreeting().then(function() {
					domConstruct.destroy(greetingViewId);
				});
			}else {
				return false;
			}
		},

		postCreate: function () {
			this.inherited(arguments);

			var isAdmin = dom.byId('role').value;
			var username = dom.byId('username').value;

			if(isAdmin.toLowerCase() !== 'true' && username !== this.updatedBy){
				domStyle.set(this.deleteGreeting, "display", "none");
				domStyle.set(this.editGreeting, "display", "none");
			}
		}
	});

});