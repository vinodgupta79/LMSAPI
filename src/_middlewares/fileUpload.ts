import multer = require("multer");
const moment = require('moment');
import fs = require('fs');

const fileFilter = (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(PDF|pdf)$/)) {
        return cb(new Error('Only pdf and image files are allowed!'), false);
    }
    cb(null, true);
};

function getDateAsstring() {
    var dt = new Date();
    return dt.getFullYear().toString() + '-' + (dt.getMonth() + 1).toString() + '-' + dt.getDate().toString() + '-' + dt.getHours().toString() + '-' + dt.getMinutes().toString() + '-' + dt.getSeconds().toString() + '-' + dt.getMilliseconds().toString();
}

var imageFileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, `uploaddocument`)
    },
    filename: function (req, file, cb) {
        console.log("key1", req);
        let bodypart: any = req.body;
        var key1 = req;

        var fname = req;
        // debugger
        var doc = JSON.parse(JSON.stringify(fname.body)).docname;
        var splitedFileName = file.originalname.split('.');
        var fileExt = splitedFileName[splitedFileName.length - 1];
        var newFileName = splitedFileName[0] + '-' + getDateAsstring();
        cb(null, newFileName + '.' + fileExt);
        // cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }
})


// Define the maximum size for uploading
// picture i.e. 5 MB. it is optional
const maxSize = 5 * 1000 * 1000 * 10;


var uploadFile = multer({
    storage: imageFileStorage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter
}).single("uploadFile");


export const FileUploader = {
    uploadFile
}