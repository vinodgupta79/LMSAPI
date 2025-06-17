import { ErrorRequestHandler, RequestHandler } from "express";
import commonService from '../_services/commonService';
import createHttpError from "http-errors";
import response from "../_middlewares/response";
import crypto from 'crypto';
import constants from "../_dbs/oracle/constants";
import axios from "axios";



import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
import authService from '../_services/authService';
import userService from '../_services/userService';
import { sign, SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../_models/user';
import UserType from '../_models/userType';
import { jobs } from '../_jobs/createQrToken';
import bcrypt from 'bcryptjs';
import config from '../_configs/default'
import Email from "../_models/email";
import EmailSender from '../_middlewares/email'
import { generateToken } from './../_middlewares/jwt';
import logger from '../_middlewares/logger';
import authToken from "../_middlewares/authToken";
import { log } from "console";
//import { console } from "inspector" ;


function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}




const viewregister: RequestHandler = async (req, res, next) => {
    try {

        let result: any = await commonService.viewregister(req.body.userId)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const ViewTaskstatus: RequestHandler = async (req, res, next) => {
    try {

        let result: any = await commonService.ViewTaskstatus(req.body.userId)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const ViewWagonstatus: RequestHandler = async (req, res, next) => {
    try {
        // debugger
        let result: any = await commonService.ViewWagonstatus(req.body.Task_id)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const notification: RequestHandler = async (req, res, next) => {
    try {


        let result: any = await commonService.notification(req.body.userId)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};


const beneficiaryR: RequestHandler = async (req, res, next) => {
    try {
        //// debugger

        let result: any = await commonService.beneficiaryR(
            req.body.Ac_Holder_Name
        )
        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const signin: RequestHandler = async (req, res, next) => {
    try {

        let result: any = await commonService.signin(req.body.userid, req.body.password, req.body.loginfrom)

        let changeDetail: any = result;
        console.log(changeDetail);


        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        console.log(er);
        next(createHttpError('500', er.message));
    }

};

const checkauth: RequestHandler = async (req, res, next) => {
    try {

        let result: any = await commonService.checkauth(req.body.emailid, req.body.role, req.body.loginfrom)

        let changeDetail: any = result;
        console.log(changeDetail);


        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        console.log(er);

        next(createHttpError('500', er.message));
    }

};

export default {


    signin,
    checkauth,
    ViewTaskstatus,
    ViewWagonstatus,
    beneficiaryR,
    notification,
    viewregister
}