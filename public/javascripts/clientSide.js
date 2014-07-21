var socket = io();
$('#message_form').submit(function() {
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
});
socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
});







// //Get data and serve it to clientside.
// $.ajax({
//     type: 'GET',
//     dataType: 'JSON',
//     url: './getData'
// }).done(function(data) {
//     for (i = 0; i < divs.length; i += 1) {
//         getNumbers.getNumbers(data[i].numbers, divs[i]);
//         getGraphs.graph(data[i].graph_data, divs[i]);
//     }
// });

// //Event Handler, particularly a tab handler
// $('.tab').hide();
// $('.tab').filter('#overview').show();
// $('.button').filter('#overview').css('background-color', 'whitesmoke');

// _.each(divs, function(div) {
//     $('.button').filter(div)
//         .on('click', function() {
//             $('.tab').hide();
//             $('.tab').filter(div).show();
//             $('.button').css('background-color', 'silver');
//             $(this).css('background-color', 'whitesmoke');
//         })
//         .on('mouseover', function() {
//             $(this).css('color', 'orange');
//         })









//         .on('mouseout', function() {
//             $(this).css('color', 'black');
//         });
// });
