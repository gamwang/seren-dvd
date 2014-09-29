var socket = io();
$('#message_form').submit(function() {
    socket.emit('message', $('#message').val());
    $('#message').val('');
    return false;
});
$('#video_query_form').submit(function() {
    socket.emit('video', $('#video_query_input').val());
    $('#video_query_input').val('');
    return false;
});
socket.on('message', function(msg) {
    $('#messages').append($('<li>').text(msg));
});
socket.on('join', function(name) {
    $('#people_online').append($('<li>').text(name));
});
socket.on('video',function(video_url) {
    $('#video_display').append('<iframe src=' + video_url + ' width=500 height=500/iframe>');
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
