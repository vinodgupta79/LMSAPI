import { Router } from "express";

import upload from "../controllers/uploadController";
import common from "../controllers/commonController";
import multer from "multer";
import path from "path";


const router = Router();
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        //// debugger
        cb(null, 'uploads/container/');
    },
    filename: function (req, file, cb) {

        // console.log("storage:", req.body);
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
})

const uploadf = multer({ storage: storage });


router.post('/viewregister', common.viewregister);
router.post('/uploadFile', upload.uploadFile);
router.post('/taskstatus', common.ViewTaskstatus);
router.post('/wagonstatus', common.ViewWagonstatus);
router.post('/uploadImage', uploadf.fields([
    { name: "fullImage", maxCount: 1 },
    { name: "croppedImage", maxCount: 1 },
    { name: "wagonImage", maxCount: 1 },
    { name: "wagoncroppedImage", maxCount: 1 },
]), upload.uploadImage);


export default router;