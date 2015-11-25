define([
    "dojo/_base/declare",
    "./_ViewBaseMixin",
    "dojo/text!../templates/GreetingView.html"
], function (declare, _ViewBaseMixin, template) {

    return declare("guestbook.view.GreetingView", [_ViewBaseMixin], {
        templateString: template,
        constructor: function(guestbook){
            this.createDate = guestbook.date;
            this.name = guestbook.guestbook_name;
            this.content = guestbook.content;
            this.updatedBy = guestbook.updated_by;
            this.updatedDate = guestbook.updated_date;
        },

        //createDate: this.createDate,

        postCreate: function () {
            // do my stuff, then...
            this.inherited(arguments);
        }
    });

});