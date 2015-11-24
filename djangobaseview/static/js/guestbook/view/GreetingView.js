define([
    "dojo/_base/declare",
    "./_ViewBaseMixin",
    "dojo/text!../templates/GreetingView.html"
], function (declare, _ViewBaseMixin, template) {

    return declare("guestbook.view.GreetingView", [_ViewBaseMixin], {

        updated_date: "",
        updated_by: "",
        guestbook_name: "",
        date: "",
        content: "",

        templateString: template,
        //	some properties
        baseClass: "someWidget",

        postCreate: function () {
            // do my stuff, then...
            this.inherited(arguments);
        }
    });

});