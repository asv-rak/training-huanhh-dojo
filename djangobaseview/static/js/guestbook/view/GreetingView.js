define([
    "dojo/_base/declare",
    "./_ViewBaseMixin",
    "dojo/text!../templates/GreetingView.html"
], function (declare, _ViewBaseMixin, template) {

    return declare("guestbook.view.GreetingView", [_ViewBaseMixin], {
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