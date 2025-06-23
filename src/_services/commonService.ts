import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
import constants from '../_dbs/oracle/constants';
import User from '../_models/user';
import UserType from '../_models/userType';
import encript from '../_middlewares/encript'
import axios from 'axios';
var request = require('request');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { baseurl } from '../baseurl'
require('dotenv').config();


const beneficiaryR = async (Ac_Holder_Name: string): Promise<any> => {
    let res: any = [];
    try {



        const jsonObject = JSON.parse(JSON.stringify(res));

        const statuscode = jsonObject.statuscode;
        const beneficiary_id = jsonObject.beneficiaryid;
        let data = '';


        let config = {
            method: 'post',
            url: `${baseurl}/beneficiaries`,
            headers: {
                'x-client-id': String(process.env.clientkey),
                'x-client-secret': String(process.env.secretclientkey),
                'x-api-version': '2023-03-01',
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {

                const restypename = 'beneficiary';
                const resd = JSON.stringify(response.data);
                const newresd = resd.replace(/'/g, '"');
                // console.log(newresd);
                //// debugger
                sequelize.query(`call updateresp(:customer_id,:resdata,:restypename)`, {
                    replacements: {
                        customer_id: beneficiary_id,
                        resdata: newresd,//JSON.parse(JSON.stringify(response.data)),
                        restypename: restypename,
                    },
                    type: QueryTypes.SELECT

                });

                //  console.log(JSON.stringify(response.data));
            })
            .catch((error) => {

                console.log(error);
            });

        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};


const ViewTaskstatus = async (registered_userid: string): Promise<any> => {
    let res: any = [];
    try {



        return await sequelize.query(`SELECT taskid,trainno, COUNT(*) AS total_count,COUNT(CASE WHEN ocr_flag = 'Y' THEN 1 END) AS ocr_flag_count,max(upload_time) upload_date FROM taskdetails where registereduserid='${registered_userid}' GROUP BY taskid,trainno`, {
            replacements: {
                registered_userid: registered_userid,
            },
            type: QueryTypes.SELECT

        });

        //   res = result;

        // return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const ViewWagonstatus = async (Task_id: string): Promise<any> => {
    let res: any = [];
    try {



        return await sequelize.query(`SELECT * FROM taskdetails where taskid='${Task_id}' order by id desc`, {
            replacements: {
                registered_userid: Task_id,
            },
            type: QueryTypes.SELECT

        });

        //   res = result;

        // return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const viewregister = async (registered_userid: string): Promise<any> => {
    let res: any = [];
    try {

        //// debugger
        return await sequelize.query(`SELECT  emailid, mobile, createdon,  userid FROM register_user where userid='${registered_userid}'`, {
            replacements: {
                registered_userid: registered_userid,
            },
            type: QueryTypes.SELECT

        });

        //   res = result;

        // return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};



const notification = async (userId: string): Promise<any> => {
    let res: any = [];
    try {

        //// debugger

        return await sequelize.query(`select id,title,replace(message,'"','')message,ndate from cit_notification where userid='${userId}' order by id desc`, {
            replacements: {
                userId: userId
            },
            type: QueryTypes.SELECT

        });

        //res = result[0][0];

        // return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const docdetails = async (newcoachimage_FI: string,
    newcoachimage_CI: string,
    newwagon_FI: string,
    newwagon_CI: string,
    uid: string,
    LNG: string,
    taskid: string,
    wagonid: string,
    lock_bar_code: string,
    train_no: string,
    capturetime: string,
    taskremarks: string
): Promise<any> => {
    let res: any = [];
    try {

        //// debugger
        const result: any = await sequelize.query(`CALL taskregister(:newcoachimage_FI,:newcoachimage_CI,:newwagon_FI,:newwagon_CI,:uid,:LNG,:taskid,:wagonid,:lock_bar_code,:train_no,:capturetime,:taskremarks)`, {
            replacements: {
                newcoachimage_FI: newcoachimage_FI,
                newcoachimage_CI: newcoachimage_CI,
                newwagon_FI: newwagon_FI,
                newwagon_CI: newwagon_CI,
                uid: uid,
                LNG: LNG,
                taskid: taskid,
                wagonid: wagonid,
                lock_bar_code: lock_bar_code,
                train_no: train_no,
                capturetime: capturetime,
                taskremarks: taskremarks,
            },
            type: QueryTypes.SELECT

        });
        res = result[0][0];
        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const Getupload = async (userId: string, beneficiary_id: string, remitter_id: string): Promise<any> => {
    let res: any = [];
    try {

        //// debugger

        return await sequelize.query(`select idcit_documentsstore as id ,typeofdocument,documentpath,registereduserid,remitterid,beneficiaryid,docid,responsedata from  cit_documentsstore where registereduserid='${userId}' and beneficiaryid='${beneficiary_id}' and remitterid='${remitter_id}'`, {
            replacements: {
                userId: userId
            },
            type: QueryTypes.SELECT

        });

        // res = result[0][0];

        //  return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const signin = async (userId: string, psd: string, loginfrom: string): Promise<any> => {

    //debugger
    let res: any = [];

    // console.log("from req", psd);
    try {

        /*const checkpwd: any = await sequelize.query(`CALL getloginhash(:userId)`, {
            replacements: {
                userId: userId,
            }
        });
        console.log("hello");

        console.log("from db", checkpwd[0].pass);
        console.log("uid", checkpwd[0].uid);
        // 
        const check = await bcrypt.compare(psd, checkpwd[0].pass);
        console.log("is compare:", check)*/
        const saltRounds = 5;
        const hasheduid = await bcrypt.hash(userId, saltRounds);
        // console.log("enc", hasheduid);



        const payload = {
            data: userId
        };

        const option = {
            expiresIn: "10d",
        };

        const secretKey: any = process.env.ACCESS_TOKEN;
        const token = jwt.sign(payload, secretKey, option);
        // console.log(token)



        const result: any = await sequelize.query(`CALL getlogin(:userId,:psd,:loginfrom,:token)`, {
            replacements: {
                userId: userId,
                psd: psd,
                loginfrom: loginfrom,
                token: token,


            },
            type: QueryTypes.SELECT

        });


        res = result[0][0];
        // console.log(res);


        return res;
    }
    catch (err) {
        let er: any = err;
        console.log(er);

        throw er;
    }
};

const checkauth = async (email: string, role: string, loginfrom: string): Promise<any> => {

    // debugger
    let res: any = [];


    try {


        const saltRounds = 5;
        const hasheduid = await bcrypt.hash(email, saltRounds);
        // console.log("enc", hasheduid);



        const payload = {
            data: email
        };

        const option = {
            expiresIn: "10d",
        };

        const secretKey: any = process.env.ACCESS_TOKEN;
        const token = jwt.sign(payload, secretKey, option);
        console.log(token)



        const result: any = await sequelize.query(
            `CALL checkauth(:email, :role, :loginfrom, :token)`,
            {
                replacements: { email, role, loginfrom, token },
                type: QueryTypes.SELECT,
            }
        );


        res = result[0][0];

        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};


export default {


    signin,
    checkauth,

    // below routes not in use
    ViewTaskstatus,
    ViewWagonstatus,
    beneficiaryR,
    notification,
    docdetails,
    Getupload,
    viewregister

}
