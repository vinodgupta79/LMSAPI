import { ErrorRequestHandler, RequestHandler } from "express";
import { FileUploader } from '../_middlewares/fileUpload';
import createHttpError from "http-errors";
import response from "../_middlewares/response";
import commonService from '../_services/commonService';

import fs from 'fs';
import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
import constants from '../_dbs/oracle/constants';

const FormData = require('form-data');




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

import path from 'path';
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
import cors from 'cors';

import crypto from 'crypto';
import { baseurl } from "../baseurl";
const jwt = require('jsonwebtoken');

express.static(path.join(__dirname, 'public'));

const initiateSale = async (result: any, mertxn: any, txnDate: any) => {
    const requestBody = {
        merchantId: "T_20239",
        merchantTxnNo: mertxn,
        amount: "100.00",
        currencyCode: "356",
        payType: "0",
        customerEmailID: "shailaja.kashid@phicommerce.com",
        transactionType: "SALE",
        returnURL: "https://qa.phicommerce.com/pg/api/merchant",
        txnDate: txnDate,
        customerMobileNo: "9970064051",
        customerName: "shailaja",
        secureHash: result,
    };

    try {
        const response = await axios.post(
            "https://qa.phicommerce.com/pg/api/v2/initiateSale",
            requestBody
        );
        //   console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const paymentstatus = async (result: any, merchantId: any, amount: any, transactionType: any, merchantTxnNo: any, originalTxnNo: any) => {

    const requestBody = {
        merchantId: merchantId,
        amount: amount,
        transactionType: transactionType,
        merchantTxnNo: merchantTxnNo,
        originalTxnNo: originalTxnNo,
        secureHash: result,
    };

    try {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const response = await axios.post(
            "https://qa.phicommerce.com/pg/api/command",
            requestBody,
            { headers }
        );
        // console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};


const orderstatus = async (orderid: any) => {

    // const requestBody = {
    //     merchantId: orderid,
    //     amount: amount,
    //     transactionType: transactionType,
    //     merchantTxnNo: merchantTxnNo,
    //     originalTxnNo: originalTxnNo,
    //     secureHash: result,
    // };
    // debugger
    try {
        const

            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-client-id': String(process.env.clientkey),
                'x-client-secret': String(process.env.secretclientkey),
                'x-api-version': '2023-03-01',

            };
        const response = await axios.get(
            `${baseurl}/orders/${orderid}`,

            { headers }
        );
        // console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};

function hmacDigest(msg: any, keyString: any) {
    try {
        const key = Buffer.from(keyString, 'utf-8');
        const msgBuffer = Buffer.from(msg, 'ascii');
        const hmacObj = crypto.createHmac('sha256', key);
        hmacObj.update(msgBuffer);
        const digest = hmacObj.digest();
        const hexDigest = digest.toString('hex');
        return hexDigest;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

const paypayload: RequestHandler = async (req, res, next) => {

    const mertxn = req.body.merchantTxnId;
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    // let hours = date_ob.getHours();
    // let minutes = date_ob.getMinutes();
    // let seconds = date_ob.getSeconds();
    // let rval=
    //// debugger
    //  const txnDate = `${year}${month}${date}${hours}${minutes}${seconds}`;
    const txnDate = `${year}${month}${date}`;
    // year+month+date//req.body.txnDate;

    //const result = req.body.result;

    // console.log(date_ob);
    const message = `100.00356shailaja.kashid@phicommerce.com9970064051shailajaT_20239${mertxn}0https://qa.phicommerce.com/pg/api/merchantSALE${txnDate}`;
    const key = "abc";

    const result = hmacDigest(message, key);

    //console.log("securehash:", result, "mertxn:", mertxn, "txnDate", txnDate);

    try {
        const abcd = await initiateSale(result, mertxn, txnDate);
        //console.log("print", abcd);
        res.json({ message: 'Sale initiated successfully!', value: abcd });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

const Salestatus: RequestHandler = async (req, res, next) => {


    const merchantId = req.body.merchantId;
    const amount = req.body.amount;
    const transactionType = req.body.transactionType;
    const merchantTxnNo = req.body.merchantTxnNo;
    const originalTxnNo = req.body.originalTxnNo;


    const message = `${amount}${merchantId}${merchantTxnNo}${originalTxnNo}${transactionType}`;
    // message = "amount+merchantId+merchantTxnNo+originalTxnNo+transactionType"
    //const message = `100.00356shailaja.kashid@phicommerce.com9970064051shailajaT_20239${mertxn}0https://qa.phicommerce.com/pg/api/merchantSALE${txnDate}`;
    const key = "abc";

    const result = hmacDigest(message, key);

    // console.log("securehash:", result, "mertxn:", mertxn, "txnDate", txnDate);

    try {
        const abcd = await paymentstatus(result, merchantId, amount, transactionType, merchantTxnNo, originalTxnNo);
        // console.log("print", abcd);
        res.json(abcd);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

const vieworderstatus: RequestHandler = async (req, res, next) => {
    // debugger

    const orderid = req.body.Order_id;
    // const message = `${amount}${merchantId}${merchantTxnNo}${originalTxnNo}${transactionType}`;
    // // message = "amount+merchantId+merchantTxnNo+originalTxnNo+transactionType"
    // //const message = `100.00356shailaja.kashid@phicommerce.com9970064051shailajaT_20239${mertxn}0https://qa.phicommerce.com/pg/api/merchantSALE${txnDate}`;
    // const key = "abc";

    // const result = hmacDigest(message, key);

    // console.log("securehash:", result, "mertxn:", mertxn, "txnDate", txnDate);

    try {
        const abcd = await orderstatus(orderid);
        // console.log("print", abcd);
        res.json(abcd);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }

};


function genjwttoken() {
    //// debugger
    try {
        const jwt = require('jsonwebtoken');
        const secretKey = 'UTA5U1VEQXdNREF4VFZSSmVrNUVWVEpPZWxVd1RuYzlQUT09';
        const payload = {
            'timestamp': 154104425700,
            'partnerId': 'CORP00001',
            'reqid': 19924
        };
        const options = {
            algorithm: 'HS256',
            expiresIn: '1h', // Token will expire in 1 hour
        };
        const token = jwt.sign(payload, secretKey, options);
        return token;
    }
    catch (error) {
        console.error("Error:", error);
        return null;
    }
}
const jwttoken: RequestHandler = async (req, res, next) => {

    const reqid = req.body.uniqueid
    const jwt = require('jsonwebtoken');
    const secretKey = 'UTA5U1VEQXdNREF4VFZSSmVrNUVWVEpPZWxVd1RuYzlQUT09';
    const payload = {
        'timestamp': 154104425700,
        'partnerId': 'CORP00001',
        'reqid': 19924
    };
    const options = {
        algorithm: 'HS256', // Specify the algorithm
        expiresIn: '1h',    // Token will expire in 1 hour
    };
    const token = jwt.sign(payload, secretKey, options);
    res.json({ message: 'successfully!', token: token });



};

const vfyaadhar = async (aadhaarno: any,) => {

    const requestBody = {
        id_number: aadhaarno
    };

    try {
        const headers = {
            'Authorisedkey': 'TVRJek5EVTJOelUwTnpKRFQxSlFNREF3TURFPQ==',
            'accept': 'application/json',
            'Token': await genjwttoken(),
            'Content-Type': 'application/json'
        };
        const response = await axios.post(
            "https://uat.paysprint.in/sprintverify-uat/api/v1/verification/aadhaar_without_otp",
            requestBody,
            { headers }
        );
        // console.log("API Response:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }


};

const aadharvarify: RequestHandler = async (req, res, next) => {

    // debugger;
    const aadhaarno = req.body.id_number;


    // console.log("securehash:", result, "mertxn:", mertxn, "txnDate", txnDate);

    try {
        const abcd = await vfyaadhar(aadhaarno);
        res.json(abcd);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }

};


const vfypan = async (PANNO: any,) => {
    // // debugger
    const requestBody = {
        id_number: PANNO
    };
    try {
        const headers = {
            'Authorisedkey': 'TVRJek5EVTJOelUwTnpKRFQxSlFNREF3TURFPQ==',
            'accept': 'application/json',
            'Token': genjwttoken(),
            'Content-Type': 'application/json'
        };
        const response = await axios.post("https://uat.paysprint.in/sprintverify-uat/api/v1/verification/pandetails_verify",
            requestBody,
            { headers }
        );
        // console.log("API Response:", response.data);
        //// debugger
        return response.data;
    }
    catch (error) {
        console.error("Error:", error);
    }
};



const panvarify: RequestHandler = async (req, res, next) => {

    // debugger
    const PANNO = req.body.id_number;
    // console.log("securehash:", result, "mertxn:", mertxn, "txnDate", txnDate);
    try {
        const abcd = await vfypan(PANNO);
        res.json(abcd);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

function gen_jwt_token() {
    try {
        const secretKey = 'UTA5U1VEQXdNREF4TURVeFQxUmplRTFVVlROTmFtdDVUbWM5UFE9PQ==';
        const payload = {
            'timestamp': 154104425700,
            'partnerId': 'CORP00001051',
            'reqid': 19924
        };
        const options = {
            algorithm: 'HS256',
            expiresIn: '1h', // Token will expire in 1 hour
        };
        const token = jwt.sign(payload, secretKey, options);
        return token;
    }
    catch (error) {
        console.error("Error:", error);
        return null;
    }
}

const verifypan: RequestHandler = async (req, res, next) => {
    const tokenforall = gen_jwt_token();
    // debugger
    try {
        const response = await axios.post(
            "https://api.verifya2z.com/api/v1/verification/pandetails_verify",

            {
                "id_number": req.body.id_number
            },
            {
                headers: {
                    "Token": tokenforall,
                    "User-Agent": "CORP00001051"

                },
            }
        );
        // console.log(response.data)
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
    }
};

const verifyaadhar: RequestHandler = async (req, res, next) => {
    const tokenforall = gen_jwt_token();
    // debugger
    try {
        const response = await axios.post(

            "https://api.verifya2z.com/api/v1/verification/aadhaar_without_otp",
            {
                "id_number": req.body.id_number
            },
            {
                headers: {
                    "Token": tokenforall,
                    "User-Agent": "CORP00001051"

                },
            }
        );
        // console.log(response.data)
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
    }
};


export default {
    paypayload,
    Salestatus,
    jwttoken,
    aadharvarify,
    panvarify,
    verifyaadhar,
    verifypan,
    vieworderstatus,
}