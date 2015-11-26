define([
    "dojo/on",
    "dojo/request",
    "dojo/cookie",
    "dojo/_base/declare",
    "./_ViewBaseMixin",
    "../store/GreetingStore",
    "dojo/text!../templates/GuestBookView.html",
    "dijit/form/Form",
    "dijit/form/TextBox",
    "dijit/form/Textarea",
    "dijit/form/Button"
], function (on, request, cookie, declare, _ViewBaseMixin, GreetingStore, template) {
    return declare("guestbook.view.GuestBookView", [_ViewBaseMixin], {
        templateString: template,

        postCreate: function () {
            this.inherited(arguments);
            
            var guestbookNameNode = this.guestbookNameNode;
            var guestbookMessageNode = this.guestbookMessageNode;

            // add guestbook api
            this.own(
                on(this.signForm, "submit", function (e) {
                    e.preventDefault();
                    var guestbookName = guestbookNameNode.value;
                    var guestbookMessage = guestbookMessageNode.value;
                    var store = new GreetingStore(guestbookName, guestbookMessage);

                    store.addGuestbook().then(function(){
                        store.getGreetings();
                    });
                })
            );
        }
    });

});