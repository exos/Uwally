const tabs = require("tabs");
const data = require("self").data;
const pageMod = require("page-mod");

const UWally = require("uwally");

var uwidget = require("uwidget");
var ouwally = null;
var tab = null;

var search = function (q) {
    
    if (tab) {
        tab.url = 'http://uwall.tv/?q=' + escape(q);
    } else {
        tabs.open('http://uwall.tv/?q=' + escape(q));
    }
    
    this.hide();
    
} 

tabs.on('open', function onOpen(ntab) {
    if (/^[\w]+:\/\/(?:.+\.)?uwall.tv\/.*$/i.test(ntab.url)) {
        tab = ntab;
    }
});

tabs.on('ready', function onOpen(ntab) {
    if (/^[\w]+:\/\/(?:.+\.)?uwall.tv\/.*$/i.test(ntab.url)) {
        tab = ntab;
        uwidget.setOn();
        
        tab.on('close', function () {
            uwidget.setOff();
            tab = null;
        });
    }
});

var eject = function () {
    console.log("eject!");
    
    if (tab) {
        tab.activate();
    } else {
        tabs.open({
            url: "http://www.uwall.tv",
            isPinned: true,
            onOpen: function onOpen(ntab) {
                tab = ntab;
                uwidget.setOn();
            }
        });
        
        tab.on('close', function () {
            uwidget.setOff();
            tab = null;
        });
        
    }
}

uwidget.on('eject', eject);
uwidget.onsearch(search);

pageMod.PageMod({
  include: [
	"http://uwtv.sytes.net/player_lightbox_iframe.php*"
  ],
  contentScriptWhen: 'ready',
  contentScriptFile: data.url("onpage.js"),
  onAttach: function (worker) {
     
      worker.on('message', function (cmd) {
          
        if (cmd.cmd == 'player_ready') {
            
            if (!ouwally) {
                console.log("Creo uwally");
                tab = worker.tab;
                ouwally = new UWally(cmd, worker,uwidget);
            } else {
                console.log("Ya hay un uwally!!");
            }
            
            worker.on('detach', function () {
                console.log("murio dicha instancia... uwally!!");
                uwidget.clearListeners();
                uwidget.onsearch(search);
                uwidget.on('eject', eject);
                ouwally = null;
                uwidget.disableControlls();
            });
        }
      });
      
  }
});

