const PdfConverter = require('./lib/pdfConverter.js');
var argv = require('optimist').argv;
var options = {
    cacheDir: __dirname+'/cache',
    toDir: __dirname+'/to',
    scriptType: 'png'
};
var file = false;
if (typeof argv.render !== 'undefined') {
    options.scriptType = argv.render;
}

if (typeof argv.to !== 'undefined') {
    options.toDir = argv.to;
}

if (typeof argv.cache !== 'undefined') {
    options.cacheDir = argv.cache;
}

if (typeof argv.file !== 'undefined') {
    file = argv.file;
}

console.log(options);

var pdf = PdfConverter(options);
pdf.setInitCallback(function(result) {
    console.log('init is done');
    console.log(result);
    if (file !== false) {
        console.log(file);
        pdf.render(file, 'test-images', function(error, stdOut, stdError) {
            console.log(stdError);
        });
    }

});
pdf.init();




