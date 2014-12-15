($(document).ready(function() {
    var socket = io();

    // Username Modal
    $('#user_modal').modal({
        show: true
    });

    socket.on('post', function(content) {
        $('div.posts').append(content);
    });

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
            return user + ': ' + payload + '<br>' + goodies.join("<br>");
        }
        else {
            return false;
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