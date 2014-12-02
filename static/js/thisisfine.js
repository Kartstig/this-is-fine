($(document).ready(function() {
    var socket = io();

    $('#content_select').on('change', function() {
        switch($('#content_select').val()) {
            case "Text":
                $('#content').prop('placeholder', 'This is fine.');
                break;
            case "URL":
                $('#content').prop('placeholder', 'http://thisisfine.com');
                break;
            case "Image":
                $('#content').prop('placeholder', 'http://thisisfine.com/static/images/thisisfine.jpg');
                break;
        }
    });

    $('form').submit(function() {
        var data = $('#content').val('');
        var sel_data = $('#content_select').val('');
        if(data) {
            socket.emit('post', data, sel_data);
            $('#content').val('');
            return false;
        }
        else {
            return false;
        }
    });

    socket.on('post', function(content, content_type) {
        switch(content_type) {
            case "Text":
                $('div.posts').append('<p class="post-data"><span class="text-post">' + content + '</span></p>');
                break;
            case "URL":
                $('div.posts').append('<p class="post-data"><a class="link-post" href="' + content + '">' + content + '</a></p>');
                break;
            case "Image":
                $('div.posts').append('<p class="post-data"><img class="image-post" src="' + content + '"></img></p>');
            default:
                break;
        }
    });
}));