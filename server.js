const http = require("http");
const url = require('url');
const express = require("express");
const multer = require('multer');
const bodyParser = require('body-parser');
const PdfConverter = require('./lib/pdfConverter.js');

var settings = {
    type: 'png',
    port: 3000,
    host: 'localhost',
    cacheDir: __dirname + '/cache',
    exportPath: __dirname + '/export',
    uploadPath: __dirname + '/uploads'
};


var app = express();
app.use(bodyParser.json());
app.use(express.static('html'));
app.set('view engine', 'ejs');
app.set('views', './views')

/* Multer upload diskstorage */
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, settings.uploadPath)
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        var filename = datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, filename);
    }
});

/* Upload Multer function */
var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        req.fileValidationError = false;
        if (file.mimetype !== 'application/pdf') {
            req.fileValidationError = 'Wrong mimetype: ' + file.mimetype;
            console.log(req.fileValidationError);
            return cb(null, false, new Error('I don\'t have a clue!'));
        }
        cb(null, true);
    }
}).single('pdf');

/* Upload form */
app.get('/', function(req, res) {
    res.render("index", {});
});


/* Upload api */
app.post('/api/photo', function(req, res) {
    var start = new Date();

    upload(req, res, function(err) {

        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        if (req.fileValidationError != false) {
            res.json({ error_code: 1, err_desc: req.fileValidationError });
            return;
        }

        //Handle dirs 
        var file = req.file.path;
        var fileDir = req.file.filename.replace('.pdf', '');
        var exportPath = settings.exportPath;
        var renderPath = exportPath + "/" + fileDir + "/";
        var imageName = fileDir + "-";


        var converter = PdfConverter({
            cacheDir: settings.cacheDir,
            toDir: renderPath,
            scriptType: settings.type
        });

        converter.setInitCallback(function(result) {
            if (result !== false) {
                converter.render(file, imageName, function(error, stdOut, stdError) {
                    if (!error) {
                        var end = new Date();
                        var time = end.getTime() - start.getTime();
                        var images = converter.getRenderedImages();

                        for (var i = 0; i < images.length; i++) {
                            var image = (images[i]);
                            var fullUrl = "/get/image/";
                            images[i] = fullUrl + fileDir + "/" + image;
                        }

                        res.json({ images: images, time: time });
                    } else {
                        res.json(error);
                    }
                });
            } else {
                res.json({ error: "Convertion not ready" });
            }
        });
        converter.init();



    });

});


/* Image loading API */
app.get('/get/image/:folder/:image', function(req, res) {
    var params = req.params;
    var folder = settings.exportPath + "/" +params.folder + "/";
    var image = params.image;
    
   
    res.sendFile(folder + image);
});


app.listen(settings.port, function() {
    console.log("Starting ExpressJS on port:"+settings.port);
});