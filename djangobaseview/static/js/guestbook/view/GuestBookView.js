define([
    "dojo/_base/declare",
    "./_ViewBaseMixin",
    "dojo/text!../templates/GuestBookView.html"
], function (declare, _ViewBaseMixin, template) {

    return declare("guestbook.view.GuestBookView", [_ViewBaseMixin], {
        templateString: template,
        //	some properties
        baseClass: "someWidget",

        // create button

        postCreate: function(){
            // do my stuff, then...
            this.inherited(arguments);
        }
    });

});