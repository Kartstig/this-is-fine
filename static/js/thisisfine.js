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
        socket.emit('post', $('#content').val(), $('#content_select').val());
        $('#content').val('');
        return false;
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