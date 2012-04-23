const widgets = require("widget");
const data = require("self").data;
const storage = require("simple-storage");

var searchPanel = require("panel").Panel({
  width: 400,
  height: 200,
  contentURL: data.url("search.html"),
  contentScriptFile: data.url("search.js")
});

var widget = widgets.Widget({
  id: "uwally-icon",
  width: 80,
  label: "UWallPlayerControl",
  contentURL: data.url('wid-off.html'),
  contentScriptFile: data.url("player-controller.js")
});

widget.on('mouseover', function (ev) {
        this.width = 200;
});

widget.on('mouseout', function (ev) {
        this.width = 80;
})

if (!storage.storage['template']) {
    storage.storage['template'] = 'default';
}

widget.port.emit('loadTemplate',storage.storage['template']);

var listeners = {};

widget.port.on('cmd', function (data) {
    
    var args = arguments;
    
    if (listeners[data]) listeners[data].forEach(function(cb) {
       // setTimeout(function () {
            cb.apply(widget,args);
       // },0);
    });
    
});

var SearchCallback = function () {
    
}

var uwidget = {

	en: false,
        
	getWidget: function() {
            return widget;
	},
        
        getSearchPanel: function() {
            return searchPanel;
        },

	setOn: function () {
            widget.port.emit('on');
	},

	setOff: function () {
            widget.port.emit('off');
	},
        
        setPlaying: function () {
            widget.port.emit('playing');
        },
        
        setPaused: function () {
            widget.port.emit('paused');
        },
        
        ejectOn: function () {
            widget.port.emit('ejectOn');
        },
        
        ejectOff: function () {
            widget.port.emit('ejectOff');
        },
        
        enabledControlls: function () {
            widget.port.emit('enabledControlls');
        },
        
        disableControlls: function () {
            widget.port.emit('disableControlls');
        },
        
        on: function (event, listener) {
            if (!listeners[event]) {
                listeners[event] = [];
            }
            
            listeners[event].push(listener);
            
        },
        
        clearListeners: function () {
            listeners = [];
            
            uwidget.on('search', function () {
    
                if (listeners['search'].length == 1) {
                    searchPanel.show(); 
                }

            });

        },
        
        onsearch: function (cb) {
            SearchCallback = cb;
        }

};

searchPanel.port.on('search',function (q) {
    SearchCallback.apply(searchPanel,[q,uwidget]);
});

uwidget.clearListeners();

module.exports = uwidget;
