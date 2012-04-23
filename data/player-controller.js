
var cmds = {

};

var template = 'default';

$$ = function (q) {
        return document.getElementById(q);
};

self.port.on('cmd', function (cmd) {
        if (cmd.cmd && cmds[cmd.cmd]) {
                cmds[cmd.cmd].apply(cmd,[]);
        }
});

self.port.on('on', function () {
        $$('container').style.opacity = 1;
});

self.port.on('off', function () {
        $$('container').style.opacity = 0.3;
});

self.port.on('playing', function () {
        $$('play-button').src =  template +'/ico/pause-on.png';
});

self.port.on('paused', function () {
        $$('play-button').src = template +'/ico/play-on.png';
});

self.port.on('disableControlls', function () {
        $$('play-button').src = template +'/ico/play-off.png';
        $$('back-button').src = template +'/ico/back-off.png';
        $$('next-button').src = template +'/ico/next-off.png';
});

self.port.on('enabledControlls', function () {
        $$('play-button').src = template +'/ico/play-on.png';
        $$('back-button').src = template +'/ico/back-on.png';
        $$('next-button').src = template +'/ico/next-on.png';
});

self.port.on('loadTemplate', function (ntemplate) {
    
    console.log("Levanto templatE", ntemplate);
    
    template = ntemplate;
    
    $$('play-button').src = template +'/ico/play-off.png';
    $$('back-button').src = template +'/ico/back-off.png';
    $$('next-button').src = template +'/ico/next-off.png';
    $$('cmdinfo').src = template +'/ico/info.png';
    $$('cmdsearch').src = template +'/ico/search.png';
});

// init

// Events

$$('play-button').onclick = function (ev) {
    self.port.emit('cmd','play');
}

$$('back-button').onclick = function (ev) {
    self.port.emit('cmd','back');
}

$$('next-button').onclick = function (ev) {
    self.port.emit('cmd','next');
}

$$('cmdinfo').onclick = function (ev) {
    self.port.emit('cmd','info');
}

$$('logo').onclick = function (ev) {
    self.port.emit('cmd','eject');
}

$$('cmdsearch').onclick = function (ev) {
    self.port.emit('cmd','search');
}

self.port.emit('cmd','listo');
