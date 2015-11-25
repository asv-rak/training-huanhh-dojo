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

        postCreate: function () {
            // do my stuff, then...
            this.inherited(arguments);

            var guestbookNameNode = this.guestbookNameNode;
            var guestbookMessageNode = this.guestbookMessageNode;

            // add guestbook api
            on(this.signForm, "submit", function (e) {
                e.preventDefault();
                var guestbookName = guestbookNameNode.value;
                var guestbookMesage = guestbookMessageNode.value;
                var apiUrl = '/api/guestbook/' + guestbookName + '/greeting/'
                request.post(apiUrl, {
                    data: {
                        guestbook_name: guestbookName,
                        guestbook_mesage: guestbookMesage
                    },
                    headers: {
                        "X-CSRFToken": cookie("csrftoken")
                    }
                }).then(function (text) {

                });

                request.get(apiUrl, {
                    headers: {
                        "X-CSRFToken": cookie("csrftoken")
                    }
                }).then(function (text) {
                    var guestbooks = JSON.parse(text).greetings;

                    if(listContainer.childNodes.length > 0){
                        listContainer.innerHTML = '';
                    }

                    array.forEach(guestbooks, function (guestbook) {
                        // Create our widget and place it
                        var widget = new GreetingView(guestbook).placeAt(listContainer);
                    });
                });
            });
        }
    });

});