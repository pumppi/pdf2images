const ShellHelper = require('./ShellHelper.js');

var PdfConverter = function(newOptions) {

    var options = {
        cacheDir: './cache',
        toDir: './to',
        scriptType: 'svg'
    }
    var svgScript = 'pdf2svg';
    var pngScript = 'convert';
    var shell = false;
    var initCallback = false;
    var pub = {};


    function checkScripts() {
        var script = false;
        if (options.scriptType === 'svg') {
            script = svgScript;
        } else if (options.scriptType === 'png') {
            script = pngScript;
        }
        if(initCallback != false){
            shell.hasShellScript(script, initCallback);
        }
        
    }


    function init(newOptions) {

        if (typeof newOptions !== 'undefined') {
            options = newOptions;
        }
        shell = ShellHelper();


        if (!shell.isDir(options.cacheDir)) {
            console.log('Creating cache dir');
            shell.makeDir(options.cacheDir);
        }

        if (!shell.isDir(options.toDir)) {
            console.log('Creating to dir');
            shell.makeDir(options.toDir);
        }

        checkScripts();






    }

    function getSVGScript(file, to, imageName) {
        return "pdf2svg " + file + " " + to  + imageName + "%05d.svg all";
    }

    function getPNGScript(file, to, imageName) {
        return "convert " + file + " -format '%s\n' -write info: " + to  + imageName + "%05d.png";
    }


    pub.setInitCallback = function(cb) {
        initCallback = cb;
    }

    pub.init = function() {
        init(newOptions);
    };

    pub.render = function(file, imageName, callback) {
        var script = false;
        if (options.scriptType === 'svg') {
            script = getSVGScript(file, options.toDir, imageName);
        }
        if (options.scriptType === 'png') {
            script = getPNGScript(file, options.toDir, imageName);
        }

        shell.execute(script, callback);


    }
    
    pub.getRenderedImages = function(){
        return shell.readDir(options.toDir);
    }






    return pub;
}

module.exports = PdfConverter;