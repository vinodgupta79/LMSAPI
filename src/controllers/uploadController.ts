import { ErrorRequestHandler, RequestHandler } from "express";
import { FileUploader } from '../_middlewares/fileUpload';
import createHttpError from "http-errors";
import response from "../_middlewares/response";
import commonService from '../_services/commonService';

import path from 'path';
import fs from 'fs';
import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
import constants from '../_dbs/oracle/constants';
const axios = require('axios');
const FormData = require('form-data');

import authService from '../_services/authService';
import userService from '../_services/userService';
import { sign, SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../_models/user';
import UserType from '../_models/userType';
import { jobs } from '../_jobs/createQrToken';
import bcrypt from 'bcryptjs';
import config from '../_configs/default';
import Email from "../_models/email";
import EmailSender from '../_middlewares/email';
import { generateToken } from './../_middlewares/jwt';
import logger from '../_middlewares/logger';
import { baseurl } from "../baseurl";

const uploadFile: RequestHandler = async (req, res, next) => {
    try {

        // console.log(req.body);
        let fileDetail: any;
        let reqdetails: any;
        let filePath: string;
        let filepath1: string;
        let docname: any;
        let imei_no: any;
        let LNG: any;
        let uid: any;
        let docpath: any;
        let localtask_id: any;
        let meter_id: any;
        let capturetime: any
        // debugger
        FileUploader.uploadFile(req, res, async function (err: any) {


            if (err) {
                next(createHttpError(400, err.message));
            }
            else {

                // debugger

                fileDetail = req.file;
                reqdetails = req;
                docname = JSON.parse(JSON.stringify(reqdetails.body)).docname;
                imei_no = JSON.parse(JSON.stringify(reqdetails.body)).imeino;
                LNG = JSON.parse(JSON.stringify(reqdetails.body)).LNG;
                uid = JSON.parse(JSON.stringify(reqdetails.body)).uid;
                localtask_id = JSON.parse(JSON.stringify(reqdetails.body)).localtask_id;
                meter_id = JSON.parse(JSON.stringify(reqdetails.body)).meter_id;
                capturetime = JSON.parse(JSON.stringify(reqdetails.body)).capturetime;



                // meterphoto_path:string,
                // cropedreading_path:string,


                if (fileDetail != undefined) {
                    filePath = path.join(__dirname + '../../../' + fileDetail.path)
                }


                //  console.log("data ", docname + "_" + bid + "_" + rid + "_" + uid + "_" + docpath)
                //res.status(200).json(response.success({ filePath: filePath }));

                const currentFileName = filePath;
                const newFileName = "uploaddocument/" + docname + "_" + uid + "_" + capturetime + "_" + imei_no + ".pdf";
                // const newFileName = 'C:/vinod/cit/api/uploaddocument/' + docname + "_" + uid + "_" + rid + "_" + bid + ".pdf";

                await fs.rename(currentFileName, newFileName, (err: any) => {
                    if (err) {
                        console.error(`Error renaming the file: ${err}`);
                    } else {
                        //// debugger
                        // let res: any = await commonService.docdetails(docname, rid, bid, uid, filePath);
                        // console.log('File renamed successfully.' + res);
                        // res.status(200).json(response.success({ filePath: filePath }));
                    }

                });
                // // debugger
                // let result: any = await commonService.docdetails(newFileName,
                //     docname,
                //     uid,
                //     imei_no,
                //     LNG,
                //     localtask_id,
                //     meter_id,
                //     capturetime);
                let changeDetail: any = "result";
                // console.log(changeDetail);
                res.status(200).json(response.success(changeDetail));




            }
        })
    }
    catch (err) {
        let er: any = err;
        next(createHttpError(400, er.message));
    }
};

const Getupload: RequestHandler = async (req, res, next) => {
    try {

        let result: any = await commonService.Getupload(req.body.customer_id, req.body.b_id, req.body.r_id);

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};
const uploadImage: RequestHandler = async (req: any, res, next) => {
    //// debugger
    let fileDetail: any;
    let reqdetails: any;
    let filePath: any;
    const fullImage: any = req.files;

    // console.log(fullImage.fullImage[0].path);
    // console.log(fullImage.croppedImage[0].path);
    // console.log(fullImage.wagonfullImage[0].path);
    // console.log(fullImage.wagoncroppedImage[0].path);
    //// debugger
    const uid = req.body.uid;
    //let imei_no: any = req.body.imeino;
    let LNG: any = req.body.location;
    let taskid: any = req.body.taskid;
    let wagonid: any = req.body.wagonid;
    let lock_bar_code: any = req.body.locks_barcode;
    let train_no: any = req.body.train_number;
    let capturetime: any = req.body.capturetime;
    let taskremarks: any = req.body.taskremarks;

    // console.log("**************", uid)

    const coach_image = fullImage.fullImage[0].path;
    const cropped_coach_image = fullImage.croppedImage[0].path;
    const wagon_image = fullImage.wagonImage[0].path;
    const cropped_wagon_image = fullImage.wagoncroppedImage[0].path;
    const newcoachimage_FI = "uploads/container/" + 'FI_' + taskid + wagonid + path.extname(coach_image);
    const newcoachimage_CI = "uploads/container/" + 'CI_' + taskid + wagonid + path.extname(cropped_coach_image);
    const newwagon_FI = "uploads/container/" + 'WFI_' + taskid + wagonid + path.extname(wagon_image);
    const newwagon_CI = "uploads/container/" + 'WCI_' + taskid + wagonid + path.extname(cropped_wagon_image);

    // const newFileName = 'C:/vinod/cit/api/uploaddocument/' + docname + "_" + uid + "_" + rid + "_" + bid + ".pdf";

    await fs.rename(coach_image, newcoachimage_FI, (err: any) => {
        if (err) {
            console.error(`Error renaming the file: ${err}`);
        } else {
            //// debugger
            // let res: any = await commonService.docdetails(docname, rid, bid, uid, filePath);
            // console.log('File renamed successfully.' + res);
            // res.status(200).json(response.success({ filePath: filePath }));
        }
    });

    await fs.rename(cropped_coach_image, newcoachimage_CI, (err: any) => {
        if (err) {
            console.error(`Error renaming the file: ${err}`);
        } else {
            //// debugger
            // let res: any = await commonService.docdetails(docname, rid, bid, uid, filePath);
            // console.log('File renamed successfully.' + res);
            // res.status(200).json(response.success({ filePath: filePath }));
        }
    });
    await fs.rename(wagon_image, newwagon_FI, (err: any) => {
        if (err) {
            console.error(`Error renaming the file: ${err}`);
        } else {
            //// debugger
            // let res: any = await commonService.docdetails(docname, rid, bid, uid, filePath);
            // console.log('File renamed successfully.' + res);
            // res.status(200).json(response.success({ filePath: filePath }));
        }
    });

    await fs.rename(cropped_wagon_image, newwagon_CI, (err: any) => {
        if (err) {
            console.error(`Error renaming the file: ${err}`);
        } else {
            //// debugger
            // let res: any = await commonService.docdetails(docname, rid, bid, uid, filePath);
            // console.log('File renamed successfully.' + res);
            // res.status(200).json(response.success({ filePath: filePath }));
        }
    });


    let result: any = await commonService.docdetails(newcoachimage_FI, newcoachimage_CI, newwagon_FI, newwagon_CI, uid, LNG, taskid, wagonid, lock_bar_code, train_no, capturetime, taskremarks);

    //let result: any = await commonService.docdetails(newFileNameFI, newFileNameCI, uid, imei_no, LNG, localtask_id, meter_id, capturetime);
    let changeDetail: any = result;
    // console.log(changeDetail);
    res.status(200).json(response.success(changeDetail));



};

export default {
    uploadFile,
    uploadImage,

    Getupload,
}