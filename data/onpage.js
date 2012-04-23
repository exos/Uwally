
if (unsafeWindow.player) {

    var player = unsafeWindow.player.player('plugin');

    var artist = {
        name: unsafeWindow.$('.artist h1').text(),
        photo: unsafeWindow.$('.artist img').attr('src')
    }

    console.log(artist.photo);

    self.postMessage({
        cmd: 'player_ready',
        status: player._state,
        artist: artist
    });
    
    var defineEvent = function (name, listener) {
        
        console.log("Wrapeo " + name);

        var listener = listener || function () {};
        var ant = player.options[name] || function () {};
        
        player.options[name] = function () {
            
            var args = arguments;
            
            console.log("Se dispara " + name);
            listener.apply(this,args);
            ant.apply(this,args);
        }

    }

    defineEvent('onVideoPlay', function (video) {
        
        var video = player.videos()[player.videoIndex()];
        
        self.postMessage({
            cmd: 'play',
            video: video
        });
    });
    
    defineEvent('onVideoPaused', function (video) {
        self.postMessage({
            cmd: 'pause'/*,
            video: player._getVideo.apply(player,[])*/
        });
    });
    
    defineEvent('onVideoCue', function () {
                
        self.postMessage({
            cmd: 'cue'
        });
    });

    // Listen...
    
    self.on('message', function (cmd) {
        player[cmd.cmd].apply(player,cmd.params);
    });

}
