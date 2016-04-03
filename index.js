const PdfConverter = require('./lib/PdfConverter.js');
var argv = require('optimist').argv;
var options = {
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

if (typeof argv.file !== 'undefined') {
    file = argv.file;
}


var pdf = PdfConverter(options);
pdf.setInitCallback(function(result) {
    if (file !== false) {
        console.log('Start rendering!');
        pdf.render(file, 'test-images', function(error, stdOut, stdError) {
            var images = pdf.getRenderedImages();
            console.log('Render is ready!');
        });
    }

});
pdf.init();





