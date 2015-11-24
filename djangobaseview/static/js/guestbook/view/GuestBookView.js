define([
    "dojo/dom",
    "dojo/on",
    "dojo/request",
    "dojo/cookie",
    "dojo/_base/declare",
    "dojo/_base/array",
    "./_ViewBaseMixin",
    "./GreetingView",
    "dojo/text!../templates/GuestBookView.html",
    "dijit/form/Form",
    "dijit/form/TextBox",
    "dijit/form/Textarea",
    "dijit/form/Button",
], function (dom, on, request, cookie, declare, array, _ViewBaseMixin, GreetingView, template) {
    return declare("guestbook.view.GuestBookView", [_ViewBaseMixin, GreetingView], {
        templateString: template,
        //	some properties
        baseClass: "someWidget",

        postCreate: function () {
            // do my stuff, then...
            this.inherited(arguments);

            // add guestbook api
            var form = dom.byId('signForm');
            on(form, "submit", function (e) {
                e.preventDefault();
                var guestbook_name = dom.byId('guestbook_name').value;
                var guestbook_mesage = dom.byId('guestbook_mesage').value;
                var apiUrl = '/api/guestbook/' + guestbook_name + '/greeting/'
                request.post(apiUrl, {
                    data: {
                        guestbook_name: guestbook_name,
                        guestbook_mesage: guestbook_mesage
                    },
                    headers: {
                        "X-CSRFToken": cookie("csrftoken")
                    }
                }).then(function (text) {
                    console.log("The server returned: ", text);
                });

                request.get(apiUrl, {
                    headers: {
                        "X-CSRFToken": cookie("csrftoken")
                    }
                }).then(function (text) {
                    console.log(text);
                    var guestbooks = JSON.parse(text).greetings;
                    var listContainer = dom.byId("listGuestbookContainer");

                    array.forEach(guestbooks, function (guestbook) {
                        // Create our widget and place it
                        var widget = new GreetingView(guestbook).placeAt(listContainer);
                    });
                });
            });
        }
    });

});