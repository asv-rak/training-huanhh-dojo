define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "./_ViewBaseMixin",
    "dojo/text!../templates/GuestBookView.html",
    "dijit/form/Form",
    "dijit/form/Button"
], function (dom, on, declare, _ViewBaseMixin, template) {

    var form = dom.byId('signForm');
    console.log(form);
    //form.submit(function (e) {
    //    e.preventDefault();
    //    console.log('submit form');
    //});

    return declare("guestbook.view.GuestBookView", [_ViewBaseMixin], {
        templateString: template,
        //	some properties
        baseClass: "someWidget",

        postCreate: function () {
            // do my stuff, then...
            this.inherited(arguments);
        }
    });

});