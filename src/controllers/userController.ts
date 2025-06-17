import { ErrorRequestHandler, RequestHandler } from "express";
import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
import authService from '../_services/authService';
import userService from '../_services/userService';
import createHttpError from "http-errors";
import { sign, SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import constants from '../_dbs/oracle/constants';
import User from '../_models/user';
import UserType from '../_models/userType';
import { jobs } from '../_jobs/createQrToken';
import response from "../_middlewares/response";
import bcrypt from 'bcryptjs';
import config from '../_configs/default'
import Email from "../_models/email";
import EmailSender from '../_middlewares/email'
import { generateToken } from './../_middlewares/jwt';
import logger from '../_middlewares/logger';
// @ts-ignore


//import ifsc from 'ifsc';





function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


const register: RequestHandler = async (req, res, next) => {
    try {
        // debugger
        let result: any = await userService.register(
            req.body.email, req.body.password, req.body.firstname, req.body.lastname, req.body.mobile)
        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));
    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const accountregister: RequestHandler = async (req, res, next) => {
    try {
        // debugger
        let result: any = await userService.accountregister(
            req.body.business_name, req.body.business_category, req.body.monthly_income,
            req.body.entity_type, req.body.pan_no, req.body.address, req.body.city, req.body.state, req.body.pincode,
            req.body.account_number, req.body.bank_name, req.body.ifsc, req.body.branch_name, req.body.bank_address, req.body.customer_id


        )
        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));
    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};
const contactus: RequestHandler = async (req, res, next) => {
    try {

        let result: any = await userService.contactus(
            req.body.fullname, req.body.email, req.body.mobile, req.body.message, req.body.divicetype)


        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const updatePassword: RequestHandler = async (req, res, next) => {
    try {
        let data = req.body;
        let passwd = data.password;
        let salt = await bcrypt.genSaltSync(<number>config.psd_salt);
        let hashPwd: string = await bcrypt.hashSync(<string>passwd, salt);
        data.password = hashPwd;
        let userDetail = await userService.updatePassword(data);
        res.status(200).json(response.success(userDetail));
    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const logIn: RequestHandler = async (req, res, next) => {
    try {

        let result: any = await userService.logIn(req.body.email, req.body.password, req.body.loginfrom, req.body.fcmtoken)

        let changeDetail: any = result;
        //  console.log(changeDetail);


        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const getUsers: RequestHandler = async (req, res, next) => {
    let userId: string = req.params.userId;
    let result: any;
    try {
        result = await userService.getUsers(userId);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

}

const getMobileDuplicateStatus: RequestHandler = async (req, res, next) => {
    let mobileNo: string = req.params.mobileNo;
    let result: any;
    try {
        result = await userService.getMobileDuplicateStatus(mobileNo);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

}

const getUserTypes: RequestHandler = async (req, res, next) => {
    let result: any;
    try {
        result = await userService.getUserTypes();
        // res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

}

const forgotPassword: RequestHandler = async (req, res, next) => {
    // console.log("changepd", req.body)
    try {

        let result: any = await userService.forgotPassword(req.body.email, req.body.nPassword, req.body.ocode)

        let changeDetail: any = result;
        // console.log(changeDetail);
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const validateifsc: RequestHandler = async (req, res, next) => {
    var ifsc = require('ifsc');
    const valueifsc = await ifsc.fetchDetails(req.body.ifsccode);
    res.status(200).json(valueifsc);

};

const studentsummary: RequestHandler = async (req, res, next) => {
    let userId: any = req.body.studentid;
    // console.log(userId);
    // debugger
    let result: any;
    try {
        result = await userService.studentsummary(userId);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const coursesummary: RequestHandler = async (req, res, next) => {
    let userId: any = req.body.studentid;
    // console.log(userId);
    // // debugger
    let result: any;
    try {
        result = await userService.coursesummary(userId, req.body.cid);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const chapertsummary: RequestHandler = async (req, res, next) => {

    // // debugger
    let result: any;
    try {
        result = await userService.chapertsummary(req.body.studentid, req.body.chapterid, req.body.chaptertype);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const addchaperttime: RequestHandler = async (req, res, next) => {

    //// debugger
    let result: any;
    try {
        result = await userService.addchaperttime(req.body.studentid, req.body.chapterid);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const testsummary: RequestHandler = async (req, res, next) => {

    //// debugger
    let result: any;
    try {
        result = await userService.testsummary(req.body.studentid, req.body.chapterid);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const updatetestanswer: RequestHandler = async (req, res, next) => {

    //// debugger
    let result: any;
    try {
        result = await userService.updatetestanswer(req.body.studentid, req.body.qid, req.body.examid, req.body.answer);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const ExamResultSummary: RequestHandler = async (req, res, next) => {
    let userId: any = req.body.studentid;
    let ExamId: any = req.body.chapterid;
    // debugger
    let result: any;
    try {
        result = await userService.ExamResultSummary(userId, ExamId);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const ExamResultDetail: RequestHandler = async (req, res, next) => {
    let userId: any = req.body.studentid;
    let ExamId: any = req.body.chapterid;
    // debugger
    let result: any;
    try {
        result = await userService.ExamResultDetail(userId, ExamId);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const ChapterUses: RequestHandler = async (req, res, next) => {

    //// debugger
    let result: any;
    try {
        result = await userService.ChapterUses(req.body.studentid, req.body.chapterid);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const GetDailyTimeLimit: RequestHandler = async (req, res, next) => {

    //// debugger
    let result: any;
    try {
        result = await userService.GetDailyTimeLimit(req.body.studentid);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const c_getGlossary: RequestHandler = async (req, res, next) => {
    try {

        let result: any = await userService.s_getGlossary();

        let glossaryDetail: any = result;
        res.status(200).json(response.success(glossaryDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};
export default {
    studentsummary,
    coursesummary,
    chapertsummary,
    addchaperttime,
    testsummary,
    updatetestanswer,
    ExamResultSummary,
    ExamResultDetail,
    ChapterUses,
    GetDailyTimeLimit,

    //---------------------
    register,
    accountregister,
    logIn,
    getUsers,
    getMobileDuplicateStatus,
    getUserTypes,
    updatePassword,
    forgotPassword,
    validateifsc,
    contactus,
    c_getGlossary
}