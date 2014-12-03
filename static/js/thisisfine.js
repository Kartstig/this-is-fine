($(document).ready(function() {
    var socket = io();

    socket.on('post', function(content) {
        $('div.posts').append(content);
    });

    // Handlers
    $('#content_select').on('change', updatePlaceholder);

    $('form').submit(function() {
        var sel_data = $('#content_select').val();
        var data = getData(sel_data);
        if(data) {
            socket.emit('post', data);
            $('#content').val('');
            return false;
        } 
        else {
            return false;
        }
    });

    function getData(content_type) {
        header = 'Anonymous: ';
        payload = $('#content').val();
        if(payload) {
            switch(content_type) {
                case "Text":
                    user = getUser();
                    return '<p class="post-data"><span class="text-post">' + user + ': ' + payload + '</span></p>';
                    break;
                case "URL":
                    return '<p class="post-data"><a class="link-post" href="' + payload + '">' + payload + '</a></p>';
                    break;
                case "Image":
                    return'<p class="post-data"><img class="image-post" src="' + payload + '"></img></p>';
                default:
                    return false;
                    break;
            }
        }
        else {
            return false;
        }
    }

    function updatePlaceholder() {
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
    }

    function getUser() {
        u = $('#user').val()
        if(u) {
            return u
        }
        else {
            return 'Anonymous'
        }
    }
}));