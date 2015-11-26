define([
    "dojo/_base/declare",
    "./_ViewBaseMixin",
    "dojo/text!../templates/GreetingView.html"
], function (declare, _ViewBaseMixin, template) {

    return declare("guestbook.view.GreetingView", [_ViewBaseMixin], {
        templateString: template,

        constructor: function(guestbook) {
            this.createDate = guestbook.date;
            this.name = guestbook.guestbook_name;
            this.content = guestbook.content;
            this.updatedBy = guestbook.updated_by;
            this.updatedDate = guestbook.updated_date;
        },

        createElement: function(label,value) {
            var tr = document.createElement('tr');
            var tdLabel = document.createElement('td');
            var tdValue = document.createElement('td');

            tdLabel.innerHTML = label;
            tr.appendChild(tdLabel);
            tdValue.innerHTML = value;
            tr.appendChild(tdValue);

            return tr;
        },

        createTableElement: function() {
            var table = document.createElement('table');

            table.setAttribute("style", "border-bottom: solid");
            table.appendChild(this.createElement('Create date',this.createDate));
            table.appendChild(this.createElement('Guestbook name', this.name));
            table.appendChild(this.createElement('Content', this.content));
            table.appendChild(this.createElement('Update date', this.updatedDate));
            table.appendChild(this.createElement('Update by', this.updatedBy));

            return table;
        },

        postCreate: function () {
            this.inherited(arguments);
        }
    });

});