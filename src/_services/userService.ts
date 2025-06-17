import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
import constants from '../_dbs/oracle/constants';
import User from '../_models/user';
import UserType from '../_models/userType';
import axios from 'axios';
var request = require('request');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { baseurl } from '../baseurl';
import { sendNotification } from '../_services/notificationService';
require('dotenv').config();

const createUser = async (user: User): Promise<User> => {
    let newUser = new User();
    newUser = user;
    try {

        const result: any = await sequelize.query(`select * from  ${constants.p_user_master}(action => 'create', userid => '${newUser.userId}', passwd => '${newUser.password}', firstname => '${newUser.firstName}', lastname => '${newUser.lastName}', mobileno => '${newUser.mobile}', emailid => '${newUser.email}', usertype => '${newUser.userTypeId}', createdby => '${newUser.createdBy}' )`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        newUser = <User>result[0];
        return newUser;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }

};

const updatePassword = async (passwordDetail: any): Promise<any> => {
    try {

        const result: any = await sequelize.query(`select * from  ${constants.p_change_user_password}(action => 'update', userid => '${passwordDetail.userId}', newpassword => '${passwordDetail.password}')`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        let changeDetail: any = result[0];
        return changeDetail;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }

};

const getUsers = async (userId: string): Promise<any> => {
    let userList: any = [];
    try {

        const usertype_list = await sequelize.query(`SELECT CURRENT_DATE, SESSIONTIMEZONE FROM DUAL;`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = usertype_list;

        return userList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getMobileDuplicateStatus = async (mobileNO: string): Promise<any> => {
    let userList: any = [];
    try {

        const user_list = await sequelize.query(`select * from  ${constants.p_user_master}(action => 'ismobileexist', mobileno => '${mobileNO}')`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = user_list[0];
        let resp: any;

        if (user_list.length > 0)
            resp = { "isDuplicate": true }
        else
            resp = { "isDuplicate": false }
        return resp;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getUserTypes = async (): Promise<any> => {
    let usertype: any[] = [];
    try {

        const usertype_list = await sequelize.query(`select * from  ${constants.p_user_type}()`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        usertype = usertype_list;

        return usertype;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};


const logIn = async (userId: string, psd: string, loginfrom: string, fcmtoken: string): Promise<any> => {

    let res: any = [];
    //  const saltRounds = 5;
    // const hashedPassword = await bcrypt.hash(psd, saltRounds);
    // console.log("enc", hashedPassword)
    // console.log("from req", psd);
    try {

        const checkpwd: any = await sequelize.query(`CALL getloginhash(:userId)`, {
            replacements: {
                userId: userId,
            }
        });
        // console.log("hello");

        // console.log("from db", checkpwd[0].pass);
        // console.log("uid", checkpwd[0].uid);
        // 
        const check = await bcrypt.compare(psd, checkpwd[0].pass);
        // console.log("is compare:", check)
        const saltRounds = 5;
        const hasheduid = await bcrypt.hash(checkpwd[0].uid, saltRounds);
        // console.log("enc", hasheduid);

        const payload = {
            data: hasheduid
        };

        const option = {
            expiresIn: "10d",
        };

        const secretKey: any = process.env.ACCESS_TOKEN;
        const token = jwt.sign(payload, secretKey, option);
        // console.log(token)



        const result: any = await sequelize.query(`CALL getlogIN_NEW(:userId, :psd,:loginfrom,:token,:fcmtoken)`, {
            replacements: {
                userId: userId,
                psd: JSON.stringify(check),
                loginfrom: loginfrom,
                token: token,
                fcmtoken: fcmtoken,

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


const orderupdate = async (orderId: string, orderdata: any, transaction_Type: string): Promise<any> => {

    let res: any = [];
    // debugger
    let mtitle: any;

    try {

        let condition = ""
        if (transaction_Type == 'O') {
            //   console.log("parse order", JSON.parse(orderdata).data.order);
            mtitle = JSON.parse(orderdata).data.order.orderStatus;
            condition = JSON.stringify(JSON.parse(orderdata).data.order);

            let paymentamount = JSON.parse(orderdata).data.order.amountToPay;
            let paymentCurrency = JSON.parse(orderdata).data.order.amountToPayCurrency;

            let orderId = JSON.parse(orderdata).data.order.orderId;
            const usertype_list = await sequelize.query(`SELECT MESSAGE,TITLE FROM cit_notification_template WHERE STATUS = '${mtitle}'`, {
                replacements: {},
                type: QueryTypes.SELECT
            });


            let data = usertype_list;

            let message = data[0].MESSAGE;
            mtitle = data[0].TITLE;




            let sb = message.replace('{order_id}', orderId).replace('${amount}', paymentamount + ' ' + paymentCurrency);


            // console.log(sb);
            //sb = `The status of your Order ID: ${JSON.parse(orderdata).data.order.orderId}, with amount of ${JSON.parse(orderdata).data.order.amountToPay} ${JSON.parse(orderdata).data.order.amountToPayCurrency}, is currently ${(JSON.parse(orderdata).data.order.orderStatus).replace('_', ' ')}`
            condition = JSON.stringify(sb);


        }
        else if (transaction_Type == 'P') {
            //   console.log("parse payment", JSON.parse(orderdata).data.payment);
            mtitle = JSON.parse(orderdata).data.payment.paymentStatus;
            let paymentamount = JSON.parse(orderdata).data.payment.paymentAmount;
            let paymentCurrency = JSON.parse(orderdata).data.payment.paymentCurrency

            let orderId = JSON.parse(orderdata).data.order.orderId;


            const usertype_list = await sequelize.query(`SELECT MESSAGE FROM cit_notification_template WHERE STATUS = '${mtitle}'`, {
                replacements: {},
                type: QueryTypes.SELECT
            });

            let data = usertype_list;

            let message = data[0].MESSAGE;

            let sb = message.replace('{order_id}', orderId).replace('${amount}', paymentamount + ' ' + paymentCurrency);


            // console.log(sb);

            // let sb = `Your ${JSON.parse(orderdata).data.payment.paymentAmount} ${JSON.parse(orderdata).data.payment.paymentCurrency} transaction on ${JSON.parse(orderdata).data.payment.paymentTime} is ${(JSON.parse(orderdata).data.payment.paymentStatus).replace('_', ' ')} via ${JSON.parse(orderdata).data.payment.paymentGroup}, Payment ID: ${JSON.parse(orderdata).data.payment.cfPaymentId} and Bank Reference : ${JSON.parse(orderdata).data.payment.bankReference}.`
            condition = JSON.stringify(sb);


        }
        else if (transaction_Type == 'R') {
            //  console.log("parse refund", JSON.parse(orderdata).data.refundData);
            mtitle = 'Refund Status'
            let sb = `Your Refund is under process.`
            condition = JSON.stringify(sb);

        }
        else {
            condition = "noting"
        }

        const result: any = await sequelize.query(`CALL updateWebhookorder(:orderId, :transation_data,:transaction_Type,:mtitle,:details)`, {
            replacements: {
                orderId: orderId,
                transation_data: condition,
                transaction_Type: transaction_Type,
                mtitle: mtitle,
                details: JSON.stringify(JSON.parse(orderdata).data)


            },
            type: QueryTypes.SELECT

        });

        res = result[0][0];
        const abs = res.fcmtoken;
        const islogin = res.is_login;
        //   console.log("token", abs, "typess", typeof (abs));
        //// debugger
        if (islogin == 'Y') {
            sendNotification(abs, JSON.parse(condition), mtitle);
        }
        res = { "message": "Webhook received successfully." };

        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};



const register = async (


    email: string, password: string, firstname: string, lastname: string, mobile: string

): Promise<any> => {


    const saltRounds = 5;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log("enc", hashedPassword)
    let res: any = [];
    try {
        //// debugger
        const result: any = await sequelize.query(`CALL register(:email,:firstname,:lastname,:mobile,:password)`, {
            replacements: {
                email: email,
                firstname: firstname,
                lastname: lastname,
                mobile: mobile,
                password: hashedPassword,
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

const accountregister = async (


    business_name: String,
    business_category: String,
    monthly_income: String,
    entity_type: String,
    pan_no: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    account_number: String,
    bank_name: String,
    ifsc: String,
    branch_name: String,
    bank_address: String,
    customer_id: String

): Promise<any> => {


    // const saltRounds = 5;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
    //  console.log("enc", hashedPassword)
    let res: any = [];
    try {
        //// debugger
        const result: any = await sequelize.query(`CALL accountregister( business_name,
            business_category,
            monthly_income,
            entity_type,
            pan_no,
            address,
            city,
            state,
            pincode,
            account_number,
            bank_name,
            ifsc,
            branch_name,
            bank_address,
           customer_id
           )`, {
            replacements: {
                business_name: business_name,
                business_category: business_category,
                monthly_income: monthly_income,
                entity_type: entity_type,
                pan_no: pan_no,
                address: address,
                city: city,
                state: state,
                pincode: pincode,
                account_number: account_number,
                bank_name: bank_name,
                ifsc: ifsc,
                branch_name: branch_name,
                bank_address: bank_address,
                customer_id: customer_id
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


const contactus = async (
    username: string, email: string, mobile: string, message: string, devicetype: string
): Promise<any> => {

    let res: any = [];
    try {

        const result: any = await sequelize.query(`CALL contactus(:username,:email,:mobile,:message,:devicetype)`, {
            replacements: {

                username: username,
                email: email,
                mobile: mobile,
                message: message,
                devicetype: devicetype,

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

const forgotPassword = async (userId: string, npsd: string, ocode: string): Promise<any> => {
    let res: any = [];
    try {
        // debugger
        const saltRounds = 5;

        const newhash = await bcrypt.hash(npsd, saltRounds);
        // console.log("enc", newhash);


        const result: any = await sequelize.query(`CALL forgetPassword(:userId, :npsd, :ocode)`, {
            replacements: {
                userId: userId,
                npsd: newhash,
                ocode: ocode
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

const studentsummary = async (userId: any): Promise<any> => {
    let userList: any = [];
    try {
        // debugger;
        const usertype_list = await sequelize.query(`SELECT URNNO,NAME,SPONSOR,ENTRYDATE,EXPIRYDATE,TRAININGSTARTDATE,TRAININGENDDATE,COURSEID ,ORGSTRUCTURENAME COURSENAME,SEC_TO_TIME(TIMEPERIODMAX) TOTALTIME,SEC_TO_TIME(USEDTIME(${userId})) USEDTIME,
        SEC_TO_TIME(TIMEPERIODMAX-USEDTIME('${userId}')) REMANING_TIME
        FROM STUDENT S,ORGSTRUCTURE O
        WHERE COURSEID=ORGSTRUCTUREID
        AND STUDENTID = '${userId}'`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = usertype_list;

        return userList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const coursesummary = async (userId: any, cid: any): Promise<any> => {
    let userList: any = [];
    try {

        const usertype_list = await sequelize.query(`WITH RECURSIVE OrgStructureCTE AS (
       SELECT 
        0 AS LEVEL,ORGSTRUCTURENAME,ORGSTRUCTUREID,PARENTKEY,SEC_TO_TIME(TIMEPERIODMAX) AS mintime, TIMEPERIODMAX AS mintimeinsecond,
        SEC_TO_TIME(USEDCHAPTERWISETIME('${userId}',ORGSTRUCTUREID)) AS usagetime,USEDCHAPTERWISETIME('${userId}',ORGSTRUCTUREID) AS usedtimeinsecond,NODEKEY,GROUPTYPE        
    FROM ORGSTRUCTURE
    WHERE ORGSTRUCTUREID = '${cid}'    
    UNION ALL        
    SELECT 
        os.LEVEL + 1 AS LEVEL,c.ORGSTRUCTURENAME, c.ORGSTRUCTUREID,c.PARENTKEY,SEC_TO_TIME(c.TIMEPERIODMAX) AS mintime,c.TIMEPERIODMAX AS mintimeinsecond,
        SEC_TO_TIME(USEDCHAPTERWISETIME('${userId}', c.ORGSTRUCTUREID)) AS usagetime,USEDCHAPTERWISETIME('${userId}', c.ORGSTRUCTUREID) AS usedtimeinsecond, c.NODEKEY,c.GROUPTYPE
    FROM ORGSTRUCTURE c
    INNER JOIN OrgStructureCTE os ON os.ORGSTRUCTUREID = c.PARENTKEY )
SELECT LEVEL,ORGSTRUCTURENAME, ORGSTRUCTUREID,PARENTKEY,mintime,mintimeinsecond,usagetime,usedtimeinsecond,NODEKEY,GROUPTYPE
FROM OrgStructureCTE ORDER BY NODEKEY,LEVEL, ORGSTRUCTUREID`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = usertype_list;

        return userList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const chapertsummary = async (userId: any, chapterid: any, chaptertype: any): Promise<any> => {
    let userList: any = [];

    const action = 'I';

    try {
        // Call the stored procedure
        await sequelize.query(`CALL addchaptertime(:userId, :chapterid, :action,:chaptertype)`, {
            replacements: {
                userId,
                chapterid,
                action,
                chaptertype,
            }
        });



        const usertype_list = await sequelize.query(`select SEQUENCE,CONTENT,CONTENTPATH from CONTENTSTATIC where ORGSTRUCTUREID='${chapterid}'`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = usertype_list;

        return userList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const addchaperttime = async (userId: number, chapterid: number): Promise<any> => {
    // let userList: any = [];
    let res: any = [];
    //// debugger
    const action = 'U';
    const chaptertype = 'c';
    try {
        const result: any = await sequelize.query(`CALL addchaptertime(:userId, :chapterid, :action,:chaptertype)`, {
            replacements: {
                userId,
                chapterid,
                action,
                chaptertype
            },
            type: QueryTypes.SELECT

        });

        res = result[0][0];

        return res;
    }

    /*       // Call the stored procedure
            await sequelize.query(`CALL addchaptertime(:userId, :chapterid, :action)`, {
                replacements: {
                    userId,
                    chapterid,
                    action
                }
            });
    
            const usertype_list = await sequelize.query(`SELECT 
        SEC_TO_TIME(SUM(s.TIMESECS)) AS usedtime,
        SEC_TO_TIME(o.TIMEPERIODMAX) AS totalchaptertime,
        ROUND(SUM(s.TIMESECS) / o.TIMEPERIODMAX * 100) AS chapterpercent
    FROM 
        STUDENTLOG s
    JOIN 
        ORGSTRUCTURE o ON s.CID = o.ORGSTRUCTUREID
    WHERE 
        s.STUDENTID = '${userId}'
        AND s.CID = '${chapterid}'`, {
                replacements: {},
                type: QueryTypes.SELECT
            });
    
            userList = usertype_list;
    
            return userList;
        }*/
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const testsummary = async (userId: any, chapterid: any): Promise<any> => {
    let userList: any = [];

    try {
        // Call the stored procedure
        await sequelize.query(`CALL GET_NEWEXAM(:chapterid,:userId )`, {
            replacements: {
                userId,
                chapterid
            }
        });

        const usertype_list = await sequelize.query(`SELECT S.QID as QID,S.STUDENTID as SID,S.EXAMID AS EID,QUESTIONTEXT, ANSWERTEXT,ANSWERTEXT1,ANSWERTEXT2,ANSWERTEXT3 FROM STUDENTEXAMDETAILS S,EXAMQUESTION E WHERE S.QID=E.QID AND S.STUDENTID = '${userId}' AND S.EXAMID = '${chapterid}'`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = usertype_list;

        return userList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const updatetestanswer = async (userId: number, qId: number, examID: number, answer: any): Promise<any> => {
    let res: any = [];
    try {
        // debugger

        const result: any = await sequelize.query(`CALL updatetestanswer(:userId, :qId,:examID, :answer)`, {
            replacements: {
                userId: userId,
                qId: qId,
                examID: examID,
                answer: answer
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

const ExamResultSummary = async (userId: any, examid: any): Promise<any> => {
    let userList: any = [];
    try {

        const usertype_list = await sequelize.query(`SELECT SUM(Total) AS TotalQuestion ,SUM(CurrectAnswer) AS CurrectAnswer,Round((SUM(CurrectAnswer) / SUM(Total)) * 100)  AS Percentage,SUM(WorngAnswer) AS WorngAnswer,SUM(NotAttempted) AS NotAttempted FROM (
SELECT Count(*) AS Total,0 AS CurrectAnswer,0 AS WorngAnswer ,0 AS NotAttempted FROM STUDENTEXAMDETAILS WHERE STUDENTID='${userId}' AND EXAMID='${examid}' 
UNION
SELECT 0,Count(*) AS CurrectAnswer,0,0 FROM STUDENTEXAMDETAILS WHERE STUDENTID='${userId}' AND EXAMID='${examid}' and ANSWERSTATUS='Y' and STUDENTANSWER is not null
UNION
SELECT 0,0,Count(*) AS WorngAnswer,0 FROM STUDENTEXAMDETAILS WHERE STUDENTID='${userId}' AND EXAMID='${examid}' and ANSWERSTATUS='N' and STUDENTANSWER is not null
UNION
SELECT 0,0,0,Count(*) AS NotAttempted FROM STUDENTEXAMDETAILS WHERE STUDENTID='${userId}' AND EXAMID='${examid}' and STUDENTANSWER is null
) AS ExamResultSummary`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = usertype_list;

        return userList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};



const ExamResultDetail = async (userId: any, chapterid: any): Promise<any> => {
    let userList: any = [];

    try {
        // Call the stored procedure
        /* await sequelize.query(`CALL GET_NEWEXAM(:chapterid,:userId )`, {
             replacements: {
                 userId,
                 chapterid
             }
         });*/

        const usertype_list = await sequelize.query(`SELECT QUESTIONTEXT, S.STUDENTANSWER AS STUDENTANSWER,CORRECTANSWER,ANSWERSTATUS FROM STUDENTEXAMDETAILS S,EXAMQUESTION E WHERE S.QID=E.QID AND S.STUDENTID = '${userId}' AND S.EXAMID = '${chapterid}'`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = usertype_list;

        return userList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};


const ChapterUses = async (userId: any, chapterid: any): Promise<any> => {
    let userList: any = [];
    try {
        const usertype_list = await sequelize.query(`SELECT 
    SEC_TO_TIME(SUM(s.TIMESECS)) AS usedtime,
    SEC_TO_TIME(o.TIMEPERIODMAX) AS totalchaptertime,
    ROUND(SUM(s.TIMESECS) / o.TIMEPERIODMAX * 100) AS chapterpercent
FROM 
    STUDENTLOG s
JOIN 
    ORGSTRUCTURE o ON s.CID = o.ORGSTRUCTUREID
WHERE 
    s.STUDENTID = '${userId}'
    AND s.CID = '${chapterid}'`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = usertype_list;

        return userList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};
const GetDailyTimeLimit = async (userId: any): Promise<any> => {
    let userList: any = [];
    try {
        const usertype_list = await sequelize.query(`SELECT gettodaystime('${userId}') as dailylimit`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        userList = usertype_list;

        return userList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};
const s_getGlossary = async (): Promise<any> => {
    let glossaryList: any = [];
    try {
        const glossaries: any = await sequelize.query(`SELECT glossary_id,term,definition,updatedAt FROM tbl_Glossary`, {
            type: QueryTypes.SELECT
        });

        glossaryList = glossaries;

        return glossaryList;
    }
    catch (err) {
        let er: any = err;
        throw er;
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

    //-----------------------below delete
    createUser,
    accountregister,
    getUsers,
    getUserTypes,
    getMobileDuplicateStatus,
    updatePassword,
    logIn,
    register,
    orderupdate,
    forgotPassword,
    contactus,
    s_getGlossary

}
