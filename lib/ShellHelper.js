const EXEC = require('child_process').exec;
const FS = require('fs');

var ShellHelper = function(){
    var pub = {};
    
    
    pub.hasShellScript = function(command, callback){
        var result = false;
        
        EXEC(command, function(error, stdOut, stdError) {
            if(error && error.code === 127){
               console.log('Install script to local machine: Command not found');
               console.log(error);
               callback(false);
            }else{
                callback(true);
            }

        });
    }
    
    
    pub.makeDir = function(dir){
        var result = true;
        if(!pub.isDir(dir)){
            FS.mkdirSync(dir);
        }
        return result;
    }
    
    pub.isDir = function(dir){
        return FS.existsSync(dir);
    }
    
    pub.readDir = function(to){
        var result = [];
        result = FS.readdirSync(to);
        return result;
    }
    
    pub.execute = function(script, callback){
        var time = new Date();
        console.log("Executing:"+script);
        EXEC(script, function(error, stdOut, stdError) {
            var executeTime = new Date();
            var running = executeTime.getTime() - time.getTime();
            console.log('Script runned: '+running+' ms');
            callback(error, stdOut, stdError);
        });
    }
    
    
    return pub;
}


module.exports = ShellHelper;