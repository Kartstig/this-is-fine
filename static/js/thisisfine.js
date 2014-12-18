($(document).ready(function() {
    var socket = io();

    // Username Modal
    $('#user_modal').modal({
        show: true
    });

    socket.on('post', function(content) {
        $('div.posts').append(content);
        scrollBottom();
    });

    socket.on('user:join', function(content) {
        $('#numUsers').html(content.numUsers);
    });

    socket.on('user:disconnect', function(content) {
        $('#numUsers').html(content.numUsers);
    });

    // Handlers
    $('form').submit(function() {
        var data = parseData();
        if(data) {
            socket.emit('post', data);
            $('#content').val('');
            return false;
        } 
        else {
            return false;
        }
    });

    $('#join-btn').on('click', joinChat);

    // Sanitize for HTML injection
    var content_keepers = [/(<a*.*\/a>)/g, /(<img*.*>)/g];
    var sanitizers = [/(<*.*>)/g];
    function parseData() {
        var payload = $('#content').val();
        if(payload) {
            var user = getUser();
            var goodies = [];
            _.each(content_keepers, function(regex) {
                if( payload.match(regex) ) {
                    _.each(payload.match(regex), function(extract) {
                        goodies.push(extract);
                    });
                }
            });
            _.each(sanitizers, function(regex) {
                payload = payload.replace(regex, "");
            });
            return '<p><span class="text-post">' + user + ': ' + payload + '</span></p><br>' + goodies.join("<br>");
        }
        else {
            return false;
        }
    }

    function getUser() {
        var u = $('#user').val()
        if(u) {
            return u
        }
        else {
            return 'Anonymous'
        }
    }

    function scrollBottom() {
        var el = $('div.posts');
        el.scrollTop(el.prop('scrollHeight'));
    }

    function joinChat() {
        socket.emit('user:join', getUser());
    }

}));