/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var cmd = {
    
    loadData: function (options) {
        
        if (options.thumb)
            $('#ficha .thumb img').attr('src',options.thumb);
        
        if (options.title)
            $('#ficha .info .title').text(options.title);
        
        if (options.desc)
            $('#ficha .info .desc').text(options.desc);
        
    }
    
}

self.port.on('cmd', function (cmd) {
        if (cmd.cmd && cmds[cmd.cmd]) {
                cmds[cmd.cmd].apply(cmd,[cmd.options]);
        }
});

self.port.emit('cmd','listo');