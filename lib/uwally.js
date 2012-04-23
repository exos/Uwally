const data = require("self").data;
const notifications = require("notifications");

var InfoPanel = require("panel").Panel({
  width: 400,
  height: 200,
  contentURL: data.url("info.html"),
  contentScriptFile: data.url("info.js")
});

var UWally = function () {
    this.initialize.apply(this, arguments);
};

UWally.prototype = {
  
    videoInfo: null,
    artistInfo: null,
  
    initialize: function (data,worker, widget) {
        this.worker = worker;
        this.widget = widget;
        this.status = data.status;
        this.artistInfo = data.artist;
        
        console.log("steo en on");
        this.widget.setOn();
        this.widget.enabledControlls();

        var $this = this;

        worker.on('message', function (cmd) {
            
            console.log("Me llega acttion del player: "+cmd.cmd);
            
            switch (cmd.cmd) {
                
                case 'play':
                    $this.widget.setPlaying();
                    $this.status = 1;
                    $this.videoInfo = cmd.video;
                    
                    for (i in cmd.video) {
                        console.log(i);
                        console.log(cmd.video[i]);
                    }
                    
                    $this.notify(
                        cmd.video.title,
                        cmd.video.description,
                        'http://img.youtube.com/vi/' + cmd.video.id + '/2.jpg' 
                    );
                    break;
                case 'pause':
                    $this.widget.setPaused();
                    $this.status = 2;
                    break;
                case 'cue':
                    for (i in cmd.video) {
                        console.log(i);
                        console.log(cmd.video[i]);
                    }
                    $this.videoInfo = cmd.video;
                    break;
                
            }
            
        });
        
        this.widget.on('play', function () {
            if ($this.status == 1) {
                $this.worker.postMessage({
                    cmd: 'pauseVideo',
                    params: []
                }); 
            } else {
                $this.worker.postMessage({
                    cmd: 'playVideo',
                    params: []
                });
            }
            
        });
        
        this.widget.on('next', function () {
            $this.worker.postMessage({
                cmd: 'nextVideo',
                params: []
            });
        });
        
        this.widget.on('back', function () {
            $this.worker.postMessage({
                cmd: 'prevVideo',
                params: []
            });
        });
        
        this.widget.on('info', function () {
           InfoPanel.show(); 
        });
        
    },
    
    notify: function (title, desc, thumb) {
        
        var $this = this;
        
        var htitle = '<h1><img src="' + data.url('logo.png') + '" alt="[uWall]" /> <em>Now playing:</em> ';
        htitle += title + "</h1>";
        
        var photo = this.artistInfo.photo;        
        
        console.log(this.artistInfo.photo);
        
        var hdesc = '<div style="float:left; width: 100px;"><img style="width: 100px; border: 0px;" src="' + photo  + '" />';
        hdesc += '<div style="padding-left: 110px;">' + desc + '</div>';
        
        notifications.notify({
            title: htitle,
            text: hdesc,
            iconUrl: thumb,
            onClick: function (data) {
                $this.worker.tab.activate();
            }
        });
        
    }

};

module.exports = UWally;
