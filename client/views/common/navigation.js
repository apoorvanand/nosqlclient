Template.navigation.rendered = function () {
    // Initialize metisMenu
    $('#side-menu').metisMenu();
};

Template.navigation.events({
    'click #btnDropDatabase': function (e) {
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this database!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, drop it!",
            closeOnConfirm: false
        }, function () {
            var connection = Connections.findOne({_id: Session.get(Template.strSessionConnection)});
            Meteor.call('dropDB', connection, function (err, result) {
                if (err) {
                    toastr.error("Couldn't drop database: " + err.message);
                    return;
                }
                if (result.error) {
                    toastr.error("Couldn't drop database: " + result.error.message);
                    return;
                }
                Template.clearSessions();
                swal({
                    title: "Dropped!",
                    text: "Successfuly dropped database " + connection.databaseName,
                    type: "success"
                });
            });
        });
    },

    'click #aAdminQueries': function () {
        Template.navigation.handleNavigationAndSessions();
    },

    'click #aBrowseDB': function () {
        Template.navigation.handleNavigationAndSessions();
    },

    'click .navCollection': function () {
        var name = this.name;

        $('#listCollectionNames').find('li').each(function (index, li) {
            var liObject = $(li);
            if (liObject[0].innerText.substr(1).trim() == name) {
                liObject.addClass('active');
            }
            else {
                liObject.removeClass('active');
            }
        });

        $('#listSystemCollections').find('li').each(function (index, li) {
            var liObject = $(li);
            if (liObject[0].innerText.substr(1).trim() == name) {
                liObject.addClass('active');
            } else {
                liObject.removeClass('active');
            }
        });

        /*$('#liBrowseDB').removeClass('active');
         $('#liAdminQueries').removeClass('active');*/

        Session.set(Template.strSessionSelectedCollection, name);
        $('#divJsonEditor').hide();
        $('#divAceEditor').hide();
    }
});

Template.navigation.handleNavigationAndSessions = function () {
    $('#listCollectionNames').find('li').each(function (index, li) {
        $(li).removeClass('active');
    });

    $('#listSystemCollections').find('li').each(function (index, li) {
        $(li).removeClass('active');
    });

    Session.set(Template.strSessionSelectedCollection, undefined);
    Session.set(Template.strSessionSelectedQuery, undefined);
    Session.set(Template.strSessionSelectedOptions, undefined);
};