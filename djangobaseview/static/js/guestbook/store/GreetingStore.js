define([
    "dojo/dom",
    "dojo/request",
    "dojo/cookie",
    "dojo/_base/declare",
    "dojo/_base/array",
    "../view/GreetingView"
], function(dom, request, cookie, declare, array, GreetingView){
    return declare(null,{
        constructor: function(guestbookName, guestbookMessage){
            this.guestbookName = guestbookName;
            this.guestbookMessage = guestbookMessage;
            this.apiUrl = '/api/guestbook/' + guestbookName + '/greeting/';
            this.headers = {"X-CSRFToken": cookie("csrftoken")};
        },

        addGuestbook: function (){
            return request.post(this.apiUrl, {
                data: {
                    guestbook_name: this.guestbookName,
                    guestbook_mesage: this.guestbookMessage
                },
                headers: this.headers
            });
        },

        getGreetings: function (){
            request.get(this.apiUrl, {
                headers: this.headers
            }).then(function (text) {
                var guestbooks = JSON.parse(text).greetings;
                var listContainer = dom.byId('listGuestbookContainer');

                if(listContainer.childNodes.length > 0){
                    listContainer.innerHTML = '';
                }

                array.forEach(guestbooks, function (guestbook) {
                    // Create our widget and place it
                    var widget = new GreetingView(guestbook).placeAt(listContainer);
                });
            });
        }
    });
});