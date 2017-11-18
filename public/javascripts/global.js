/*
 *  Code borrowed from
 *  Buecheler, Christopher. (2017, May Published). Creating a Simple RESTful Web App with Node.js, Express, and MongoDB.
 *  Retrieved from https://closebrace.com/tutorials/2017-03-02/creating-a-simple-restful-web-app-with-nodejs-express-and-mongodb
 *  Modified to fit for mySql, sequelize, express-validator by Sue Clark
 */

// Populate table on ready
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.first_name + '</td>';
            tableContent += '<td>' + this.last_name + '</td>';
            tableContent += '<td>' + this.street_addr + '</td>';
            tableContent += '<td>' + this.city + '</td>';
            tableContent += '<td>' + this.state + '</td>';
            tableContent += '<td>' + this.zip + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// We will call add user when the form is submitted.
$('#btnAddUser').on('click', addUser);

// When delete is clicked, delete the user
$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') {
            errorCount++;
        }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'first_name': $('#addUser fieldset input#setFirstName').val(),
            'last_name': $('#addUser fieldset input#setLastName').val(),
            'street_addr': $('#addUser fieldset input#setStreetAddr').val(),
            'city': $('#addUser fieldset input#setCity').val(),
            'state': $('#addUser fieldset select#setState').val(),
            'zip': $('#addUser fieldset input#setZipCode').val()
        }

        // Use AJAX to call out /users/adduser route
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form values
                $('#addUser fieldset input').val('');
                $('#addUser fieldset select').val('Alabama');

                // Clear the top note of any user error messages
                if ($('p.note').hasClass('alert-danger')) {
                    $('p.note').removeClass("alert-danger");
                    $('p.note').text('Please fill in all the fields');
                }

                // Update the table
                populateTable();

            } else {

                // We have at least one error, check if this is an object
                if ($.type(response.msg) == 'object') {
                    var errors = $.map(response.msg, function(v) { return v });
                    var error = errors[0].msg;
                    // We are only going to print the first error
                    // and let the user repair one field at a time
                    $('p.note').addClass('alert-danger');
                    $('p.note').text(error);
                } else {
                    // We have a sequelize or system error, send an alert
                    alert(response.msg);
                    return false;
                }

            }
        });
    } else {
        // If errorCount is more than 0, error out
        $('p.note').addClass('alert-danger');
        $('p.note').text('All fields must be filled in');

        return false;
    }
};

/*
 * Delete User
 */
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
                // Update the table
                populateTable();
            } else {
                alert('Error: ' + response.msg);
                return false;
            }

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
