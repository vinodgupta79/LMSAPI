import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
import constants from '../_dbs/oracle/constants';
import User from '../_models/user';
import UserType from '../_models/userType';
import encript from '../_middlewares/encript'
import axios from 'axios';
import path from 'path';
import {createPdf} from '../_services/pdfMaker';
var request = require('request');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { baseurl } from '../baseurl'
import fs from 'fs';
import { AppError } from '../helpers/customError';
import { log } from 'console';
import { getNextSequence } from './getNextSequence';
require('dotenv').config();



const viewUploadedData = async (registered_userid: string): Promise<any> => {
    let res: any = [];
    try {


        //// debugger
        return await sequelize.query(`SELECT (@row_number:=@row_number + 1) AS SNo,id,meter_photo_path,croped_reading_path,registereduserid, 
        imeino,location,servertaskid,localtaskid,meterid,meterreading,is_manual_verify,capture_time,upload_time,remarks, 
        OCR_Done,Date,Timestamp FROM (
            SELECT id,meter_photo_path, croped_reading_path, registereduserid, imeino, location, servertaskid, localtaskid, 
        meterid, meterreading, is_manual_verify,capture_time, upload_time,DATE_FORMAT(upload_time, '%d-%m-%Y') AS Date, 
        DATE_FORMAT(upload_time, '%H:%i:%s') AS Timestamp, remarks, CASE WHEN ocr_flag IS NULL THEN 'N' ELSE ocr_flag END AS OCR_Done FROM cit_documentsstore
           ORDER BY  DATE_FORMAT(upload_time, '%b %d') desc,replace(meterid,'-','') 
        ) AS subquery, (SELECT @row_number := 0) AS rn;`, {
            replacements: {
                registered_userid: 1,
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

const verifyUploadedData = async (registered_userid: string): Promise<any> => {
    let res: any = [];
    try {


        // debugger
        return await sequelize.query(`select id, meter_photo_path, croped_reading_path, registereduserid, imeino, location, servertaskid, localtaskid, meterid, meterreading, is_manual_verify, capture_time, upload_time,CASE WHEN ocr_flag IS NULL THEN 'N' ELSE ocr_flag END AS OCR_Done
                from cit_documentsstore where id>'0' and is_manual_verify='Y'  order by id desc`, {
            replacements: {
                registered_userid: 1,
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


const updateReadingData = async (LSid: string, RData: string): Promise<any> => {
    let res: any = [];
    try {


        // debugger
        const result = await sequelize.query(`CALL updatemeterreading ('${LSid}','${RData}')`, {
            replacements: {
                LSid: LSid,
                RData: RData,
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

const checkmeterreading = async (LSid: string, isverify: string, Remrks: string): Promise<any> => {
    let res: any = [];
    try {


        // debugger
        const result = await sequelize.query(`CALL updatecheckflag ('${isverify}','${LSid}','${Remrks}')`, {
            replacements: {
                isverify: isverify,
                LSid: LSid,
                Remrks: Remrks,
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

const registeruser = async (LSid: string, isverify: string, Remrks: string): Promise<any> => {
    let res: any = [];
    try {


        // debugger
        const result = await sequelize.query(`CALL updatecheckflag ('${isverify}','${LSid}','${Remrks}')`, {
            replacements: {
                isverify: isverify,
                LSid: LSid,
                Remrks: Remrks,
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

const journeydata = async (headerdata: string): Promise<any> => {
    let res: any = [];
    try {

        let data = JSON.stringify({
            "Journey_Status": "Live",
            "Journey_Type": "FAQ",
            "search_for": "",
            "search_in": "All"
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://engagelybots.ai/dmp_backend/journeydata',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczODU5MTY1MywianRpIjoiNjhiZDcwZmYtMTliNC00ZWM3LWE1MjktNjA1NzZhODhhMjMzIiwidHlwZSI6InJlZnJlc2giLCJpZGVudGl0eSI6eyJ0b2tlbjEiOiJjMjVaVjJORWJGaFNjVUZwT1dWNFZIWXhUWGRDVTFwRmIwdDVVVVppZUM5TFRTdEJWamwyTTBGTFQydFpUVVpuV0RaRFpIVlhVR3AzTUhwVVRuRTNjbWxDYVdkd2RIQkJOeXRETVZGdU9VeGlaMlJtZFV4bFEyTkRVRGhsUzFGbFdHUklkbXh5VDB0b1FteHpVa2N5TWxSclZFZGtUQ3RLTW5wNWVTOVdTMDgyTVU0M1QzQk5NRFJLV1dFMlJUbFFTVTgzSzFoRVYyaDNVVlEzTkhwTFExQndOMVk1WjBONE9HZEtha0ZrTm1Rd0wxTk1TMDkyYUdsQmMySnBZV2hUIiwidG9rZW4yIjoiZlpKNVZxblMwNG9RQ1hvSFMwRGszQT09IiwidG9rZW4zIjoiOFM3M3ZBdkkydjdpdkkwT05ObnByZz09In0sIm5iZiI6MTczODU5MTY1MywiZXhwIjoxNzM4NTk3MDUzfQ.bPSwkxvYiFEVchn85EvqJs6qAQnLvWmLp306I6ZhPFE',
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                res = JSON.stringify(response.data)
                return res;
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

const registerbatch = async (courseid: string, companyid: string, userid: string, batchsize: any): Promise<any> => {
    let res: any = [];
    try {


        // debugger
        const result = await sequelize.query(`CALL CreateNewBatch ('${companyid}','${courseid}','${batchsize}','${userid}')`, {
            replacements: {
                p_COMPANYID: companyid,
                p_COURSEID: courseid,
                p_BATCHSIZE: batchsize,
                p_CREATEDBY: userid,
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


const createnewuser = async (courseid: string, companyid: string, userid: string, batchname: string, noofuser: any): Promise<any> => {
    let res: any = [];
    try {


        const result = await sequelize.query(`CALL CreateNewUser ('${courseid}','${companyid}','${userid}','${batchname}','${noofuser}')`, {
            replacements: {
                p_COURSEID: courseid,
                p_COMPANYID: companyid,
                p_CREATEDBY: userid,
                P_batchid: batchname,
                P_noofuser: noofuser,
            },
            type: QueryTypes.SELECT

        });
        return Object.values(result[0]);
        // return result[0];
        // res = result[0][0];

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

const docdetails = async (meterphoto_path: string,
    cropedreading_path: string,
    userid: string,
    imei_no: string,
    LNG: string,
    localtask_id: string,
    meter_id: string,
    capturetime: string): Promise<any> => {
    let res: any = [];
    try {

        //// debugger
        const result: any = await sequelize.query(`CALL documentregister(:meterphoto_path,:cropedreading_path,:userid,:imei_no,:LNG,:localtask_id,:meter_id,:capturetime)`, {
            replacements: {
                meterphoto_path: meterphoto_path,
                cropedreading_path: cropedreading_path,
                userid: userid,
                imei_no: imei_no,
                LNG: LNG,
                localtask_id: localtask_id,
                meter_id: meter_id,
                capturetime: capturetime,

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

const sponsor = async (): Promise<any> => {
    let res: any = [];
    try {

        //// debugger

        return await sequelize.query(`select COMPANYALIAS as companyid,COMPANYNAME   from COMPANYDETAILS `, {
            replacements: {
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

const course = async (): Promise<any> => {
    let res: any = [];
    try {

        //// debugger

        return await sequelize.query(`select orgstructureid as courseid,orgstructurename as coursename,TIMEPERIODMAX as total_course_time,GROUPTYPE from ORGSTRUCTURE where PARENTKEY<100`, {
            replacements: {

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

//#region ASIGN COURSE 

const getAsignCourseAll = async (): Promise<any> => {
    let res: any = [];
    try {
        return await sequelize.query(`select * from asigncourse where is_active = 1;`, {
            replacements: {},
            type: QueryTypes.SELECT
        });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getAsignCourseByStudentId = async (stuId: string): Promise<any> => {
    let res: any = [];
    try {
        return await sequelize.query(`select asigncourse.course_id ,org.ORGSTRUCTURENAME  from asigncourse 
                                        join orgstructure org on org.ORGSTRUCTUREID = asigncourse.course_id
                                        where asigncourse.student_id = ${stuId} and asigncourse.is_active = 1;`, {
            replacements: {},
            type: QueryTypes.SELECT
        });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};


const getStudentsByCourseId = async (courseId: string): Promise<any> => {
    let res: any = [];
    try {
        return await sequelize.query(`SELECT ac.course_id, stu.studentid, stu.name, stu.entrydate, stu.expirydate 
                                FROM asigncourse ac JOIN student stu ON ac.student_id = stu.studentid
                                WHERE 
                                    ac.is_active = 1 
                                    AND ac.course_id = ${courseId}
                                    AND stu.entrydate < CURRENT_DATE
                                    AND stu.expirydate > CURRENT_DATE;
`, {
            replacements: {},
            type: QueryTypes.SELECT
        });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const asignCourse = async (courseIds : string[] ,stuId: string): Promise<any> => {
    let res: any = [];
    try {
        for (let index = 0; index < courseIds.length; index++) {

                const alreadyExist = await sequelize.query(`select COUNT(course_id) as course_count from asigncourse 
                                        where student_id = ${stuId} and course_id = ${courseIds[index]};`, {
                replacements: {},
                type: QueryTypes.SELECT });

                if(alreadyExist[0].course_count > 0)
                    {         
                        console.log("CONDITION TRUE");
                        const courseName : any = await sequelize.query(`select ORGSTRUCTURENAME from orgstructure where ORGSTRUCTUREID  = ${courseIds[index]};`, {
                            replacements: {},
                            type: QueryTypes.SELECT });
                        let err = new Error(`Course ${courseName[0].ORGSTRUCTURENAME} is already assigned to student ${stuId}`);
                        throw err;
                    }
                res = await sequelize.query(`INSERT INTO asigncourse
                (course_id,student_id,is_active,createdAt,createdBy,updatedAt,updatedBy)
                VALUES(${courseIds[index]},${stuId},1,NOW(),'ADMIN',NOW(),'ADMIN');`, {
                replacements: {},
                type: QueryTypes.RAW});
        }

        return res;
    }
    catch (err) {
        
        let er: any = err;
        throw er;
    }
};

const updateAsignCourse = async (courseId : string ,stuId: string): Promise<any> => {
    let res: any = [];
    try {
        return await sequelize.query(`update asigncourse
                                    set course_id = ${courseId},  
                                    is_active = 1,
                                    updatedAt = NOW(),
                                    updatedBy = 'ADMIN'
                                    where student_id = ${stuId};`, {
            replacements: {},
            type: QueryTypes.UPDATE
        });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const removeAsignCourse = async (stuId: string , courseId: string): Promise<any> => {
    let res: any = [];
    try {
        return await sequelize.query(`update asigncourse
                                    set is_active = 0,
                                    updatedAt = NOW(),
                                    updatedBy = 'ADMIN'
                                    where student_id = ${stuId}
                                    and course_id = ${courseId};`, {
            replacements: {},
            type: QueryTypes.UPDATE
        });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

//#endregion


const getUsersAll = async (sponsor : string): Promise<any> => {
    let res: any = [];
    try {
        return await sequelize.query(`SELECT student.STUDENTID,student.BATCHID,student.NAME,student.urnno,student.ENTRYDATE,
                student.EXPIRYDATE,student.TRAININGSTARTDATE,student.TRAININGENDDATE,student.TCCDATE,student.COURSEID,
                student.BRANCH,student.CITY,student.STATE,student.EMAILID,student.MOBILENO,student.REFFEREDBY,
                student.APPLICATIONNO,student.CODE,student.CERTIFICATENO,student.IPM 
                    FROM student 
                        where role = 'user' and SPONSOR = '${sponsor}' and urnno is not null;`, {
                        replacements: {},
                        type: QueryTypes.SELECT
                    });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};


//#region  PRE REQUISTIES ACTIVITY
const getPreRequisitesAll = async (): Promise<any> => {
    let res: any = [];
    try {
        return await sequelize.query(`select * from course_pre_requisites where is_active = 1;`, {
            replacements: {},
            type: QueryTypes.SELECT
        });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getPreRequisitesByCourseId = async (courseId: number): Promise<any> => {
    let res: any = [];
    try {
        return await sequelize.query(`select course_pre_requisites.course_id ,org.ORGSTRUCTURENAME, 
                                        course_pre_requisites.pre_requisites_description 
                                        from course_pre_requisites 
                                        join orgstructure org on org.ORGSTRUCTUREID = course_pre_requisites.course_id
                                        where course_pre_requisites.course_id = ${courseId} and 
                                        course_pre_requisites.is_active = 1;`, {
            replacements: {},
            type: QueryTypes.SELECT
        });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const addPreRequisites = async (courseId : number ,description: string): Promise<any> => {
    let res: any;
    try {
        
                res = await sequelize.query(`INSERT INTO course_pre_requisites
                (course_id,pre_requisites_description,is_active,createdAt,createdBy,updatedAt,updatedBy)
                VALUES(${courseId},'${description}',1,NOW(),'ADMIN',NOW(),'ADMIN');`, 
                {
                replacements: {},
                type: QueryTypes.RAW
            });
        

        return res;
    }    
    catch (err) {
        
        let er: any = err;
        throw er;
    }
};

const updatePreRequisites = async (courseId : number ,description: string): Promise<any> => {
    let res: any = [];
    try {
        let ifExists  =   await sequelize.query(`select count(course_id) as count from course_pre_requisites 
                    where course_id = ${courseId}`, {
                replacements: {},
                type: QueryTypes.SELECT
                });
                
            console.log("ifExists" , ifExists);

            if(ifExists[0].count === 0)
            {
                let err = new Error("Course Pre Requisites Not Found");
                throw err;
            }


        return await sequelize.query(`update course_pre_requisites
                                    set pre_requisites_description = '${description}',  
                                    is_active = 1,
                                    updatedAt = NOW(),
                                    updatedBy = 'ADMIN'
                                    where course_id = ${courseId};`, {
            replacements: {},
            type: QueryTypes.UPDATE
        });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const removePreRequisites   = async (courseId: number): Promise<any> => {
    let res: any = [];
    try {

        let ifExists  =   await sequelize.query(`select count(course_id) as count from course_pre_requisites 
                    where course_id = ${courseId}`, {
                replacements: {},
                type: QueryTypes.SELECT
                });
                
            console.log("ifExists" , ifExists);

            if(ifExists[0].count === 0 )
            {
                let err = new Error("Course Pre Requisites Not Found");
                throw err;
            }
            
        return await sequelize.query(`update course_pre_requisites
                                    set is_active = 0,
                                    updatedAt = NOW(),
                                    updatedBy = 'ADMIN'
                                    where course_id = ${courseId};`, {
            replacements: {},
            type: QueryTypes.UPDATE
        });
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

//#endregion



const chapter = async (courseid: any): Promise<any> => {
    let res: any = [];
    try {

        //// debugger

        return await sequelize.query(`select orgstructureid as chapterid,orgstructurename as coursename,GROUPTYPE, TIMEPERIODMAX as total_course_time,
(select count(*) from CONTENTSTATIC a where a.ORGSTRUCTUREID=b.orgstructureid) as pages from ORGSTRUCTURE b
where TIMEPERIODMIN='${courseid}' order by NODEKEY`, {
            // replacements: {

            // },
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


const getbatchname = async (courseid: string, companyid: string): Promise<any> => {
    let res: any = [];
    try {

        return await sequelize.query(`SELECT BATCHNAME,BATCHSIZE,5 as available_batch_limit FROM BATCHDETAILS WHERE COMPANYID = '${companyid}' AND COURSEID = '${courseid}'  AND BATCHNAME LIKE CONCAT('${companyid}', '${courseid}', MONTH(CURDATE()), YEAR(CURDATE()), '%')`, {
            replacements: {

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
const getuser = async (firstuser: any, lastuser: any): Promise<any> => {
    let res: any = [];
    try {

        //// debugger

        return await sequelize.query(`select * from STUDENT where studentid between ${firstuser} and ${lastuser}`, {
            // replacements: {

            // },
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
const updateuser = async (data: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `CALL updateuser(:STUDENTID, :URNNO, :NAME, :BRANCH, :CITY, :STATE, :EMAILID, :MOBILENO, :REFFEREDBY, :APPLICATIONNO, :CODE, :ACODE, :IPM)`,
            {
                replacements: {
                    STUDENTID: data.STUDENTID,
                    URNNO: data.URNNO,
                    NAME: data.NAME,
                    BRANCH: data.BRANCH,
                    CITY: data.CITY,
                    STATE: data.STATE,
                    EMAILID: data.EMAILID,
                    MOBILENO: data.MOBILENO,
                    REFFEREDBY: data.REFFEREDBY,
                    APPLICATIONNO: data.APPLICATIONNO,
                    CODE: data.CODE,
                    ACODE: data.ACODE,
                    IPM: data.IPM,
                },
                type: QueryTypes.RAW, // Use RAW for stored procedure calls
            }
        );
        return result;
    } catch (err) {
        const er: any = err;
        throw er;
    }
};

const activateuser = async (data: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `CALL activateuser(:ACTION,:STUDENTID, :URNNO, :NAME, :BRANCH, :CITY, :STATE, :EMAILID, :MOBILENO, :REFFEREDBY, :APPLICATIONNO, :CODE, :ACODE, :IPM)`,
            {
                replacements: {
                    ACTION: data.ACTION,
                    STUDENTID: data.STUDENTID,
                    URNNO: data.URNNO,
                    NAME: data.NAME,
                    BRANCH: data.BRANCH,
                    CITY: data.CITY,
                    STATE: data.STATE,
                    EMAILID: data.EMAILID,
                    MOBILENO: data.MOBILENO,
                    REFFEREDBY: data.REFFEREDBY,
                    APPLICATIONNO: data.APPLICATIONNO,
                    CODE: data.CODE,
                    ACODE: data.ACODE,
                    IPM: data.IPM,
                },
                type: QueryTypes.RAW, // Use RAW for stored procedure calls
            }
        );
        return result;
    } catch (err) {
        const er: any = err;
        throw er;
    }
};

const uploadPdfService = async (data: any): Promise<any> => {
    try {
        // Loop through the data and call the stored procedure for each item
        // console.log(data)
        for (let item of data) {
            const result = await sequelize.query(
                'CALL BulkInsertContentStatic(:ORGSTRUCTUREID, :CONTENT, :SEQUENCE, :RECORDED, :TIMED, :IMAGEPATH, :HEADER, :FOOTER, :HEADER1, :HEADER2, :CONTENTPATH)',
                {
                    replacements: {
                        ORGSTRUCTUREID: item.ORGSTRUCTUREID,
                        CONTENT: item.CONTENT,
                        SEQUENCE: item.SEQUENCE,
                        RECORDED: item.RECORDED,
                        TIMED: item.TIMED,
                        IMAGEPATH: item.IMAGEPATH,
                        HEADER: item.HEADER,
                        FOOTER: item.FOOTER,
                        HEADER1: item.HEADER1,
                        HEADER2: item.HEADER2,
                        CONTENTPATH: item.CONTENTPATH
                    },
                    type: sequelize.QueryTypes.RAW
                }
            );
        }

        return { status: 1, message: 'PDF Uploaded successfully', };
    } catch (error) {
        console.error('Error during bulk insert execution:', error);
        throw error;
    }
};
const uploadVideoService = async (item: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            'CALL BulkInsertContentStatic(:ORGSTRUCTUREID, :CONTENT, :SEQUENCE, :RECORDED, :TIMED, :IMAGEPATH, :HEADER, :FOOTER, :HEADER1, :HEADER2, :CONTENTPATH)',
            {
                replacements: {
                    ORGSTRUCTUREID: item.ORGSTRUCTUREID,
                    CONTENT: item.CONTENT,
                    SEQUENCE: item.SEQUENCE,
                    RECORDED: item.RECORDED,
                    TIMED: item.TIMED,
                    IMAGEPATH: item.IMAGEPATH,
                    HEADER: item.HEADER,
                    FOOTER: item.FOOTER,
                    HEADER1: item.HEADER1,
                    HEADER2: item.HEADER2,
                    CONTENTPATH: item.CONTENTPATH
                },
                type: sequelize.QueryTypes.RAW
            }
        );

        return { status: 1, message: 'Video Uploaded successfully', };
    } catch (error) {
        console.error('Error during uploading video:', error);
        throw error;
    }
};

// ---------------------Creation services----------------
const validateRequiredFields = (data: any, requiredFields: string[]): void => {
    for (const field of requiredFields) {
        if (!data[field]) {
            throw new AppError(`Missing required field: ${field}`, 400);
        }
    }
};
const requiredFieldsForCreation = [
    "orgStructureName",
    "parentKey",
    "position",
    "typeOfOrg",
    "hierarchyCode",
    "timePeriodMin",
    "timePeriodMax",
    "mandatoryToNext",
    "groupType",
    "orgStructureHName",
];
const executeOrgStructureProcedure = async (
    actionType: string,
    data: any
): Promise<any> => {
    try {
        const result = await sequelize.query(
            `CALL sp_orgstructure(
                :action_type,
                :p_ORGSTRUCTUREID,
                :p_ORGSTRUCTURENAME,
                :p_PARENTKEY,
                :p_POSITION,
                :p_TYPEOFORG,
                :p_HIERARCHYCODE,
                :p_TIMEPERIODMIN,
                :p_TIMEPERIODMAX,
                :p_MANDATORYTONEXT,
                :p_GROUPTYPE,
                :p_NODEKEY,
                :p_ORGSTRUCTUREHNAME
            )`,
            {
                replacements: {
                    action_type: actionType,
                    p_ORGSTRUCTUREID: null,
                    p_ORGSTRUCTURENAME: data.orgStructureName,
                    p_PARENTKEY: data.parentKey,
                    p_POSITION: data.position,
                    p_TYPEOFORG: data.typeOfOrg,
                    p_HIERARCHYCODE: data.hierarchyCode,
                    p_TIMEPERIODMIN: data.timePeriodMin,
                    p_TIMEPERIODMAX: data.timePeriodMax,
                    p_MANDATORYTONEXT: data.mandatoryToNext,
                    p_GROUPTYPE: data.groupType,
                    p_NODEKEY: null,
                    p_ORGSTRUCTUREHNAME: data.orgStructureHName,
                },
                type: QueryTypes.RAW, // Use RAW for stored procedure calls
            }
        );
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const addNewCourseService = async (data: any): Promise<any> => {
    validateRequiredFields(data, requiredFieldsForCreation);
    return executeOrgStructureProcedure("insert_new_course", data);
};

const addNewChapterService = async (data: any): Promise<any> => {
    validateRequiredFields(data, requiredFieldsForCreation);
    return executeOrgStructureProcedure("insert_new_chapter", data);
};

const addNewExamService = async (data: any): Promise<any> => {
    validateRequiredFields(data, requiredFieldsForCreation);
    return executeOrgStructureProcedure("insert_new_exam", data);
};


const addNewQuestionService = async (data: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `CALL sp_exam_question(
                :action_type,
                 :p_EXAMID,:p_QUESTIONTEXT, :p_RANDOM, :p_ANSWERTEXT, 
                :p_ANSWERTEXT1, :p_ANSWERTEXT2, :p_ANSWERTEXT3, :p_CORRECTANSWER
            )`,
            {
                replacements: {
                    action_type: "insert_new_question",
                    p_EXAMID: data.examId,
                    p_QUESTIONTEXT: data.questionText,
                    p_RANDOM: data.random,
                    p_ANSWERTEXT: data.answerText,
                    p_ANSWERTEXT1: data.answerText1,
                    p_ANSWERTEXT2: data.answerText2,
                    p_ANSWERTEXT3: data.answerText3,
                    p_CORRECTANSWER: data.correctAnswer
                },
                type: QueryTypes.RAW, // Use RAW for stored procedure calls
            }
        );
        // console.log(result)
        return result;
    }
    catch (err) {
        console.log(err)
        let er: any = err;
        throw er;
    }

};

// ---------------Update services------------------

const requiredFieldsForUpdation = [
    "orgStructureName",
    "timePeriodMax",
];
const executeOrgStructureProcedureForUpdation = async (actionType: string, data: any, id: number): Promise<any> => {
    validateRequiredFields(data, requiredFieldsForUpdation);
    try {
        const result = await sequelize.query(
            `CALL sp_orgstructure(
          :action_type,
          :p_ORGSTRUCTUREID,
          :p_ORGSTRUCTURENAME,
          :p_PARENTKEY,
          :p_POSITION,
          :p_TYPEOFORG,
          :p_HIERARCHYCODE,
          :p_TIMEPERIODMIN,
          :p_TIMEPERIODMAX,
          :p_MANDATORYTONEXT,
          :p_GROUPTYPE,
          :p_NODEKEY,
          :p_ORGSTRUCTUREHNAME
        )`,
            {
                replacements: {
                    action_type: actionType,
                    p_ORGSTRUCTUREID: id,
                    p_ORGSTRUCTURENAME: data.orgStructureName,
                    p_PARENTKEY: null,
                    p_POSITION: null,
                    p_TYPEOFORG: null,
                    p_HIERARCHYCODE: null,
                    p_TIMEPERIODMIN: data.timePeriodMin,
                    p_TIMEPERIODMAX: data.timePeriodMax,
                    p_MANDATORYTONEXT: null,
                    p_GROUPTYPE: null,
                    p_NODEKEY: null,
                    p_ORGSTRUCTUREHNAME: null
                },
                type: QueryTypes.RAW,
            }
        );
        return result;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
}
const updateCourseService = async (id: any, data: any): Promise<any> => {
    return executeOrgStructureProcedureForUpdation("update_course", data, id)
};
const updateChapterService = async (id: any, data: any): Promise<any> => {
    return executeOrgStructureProcedureForUpdation("update_chapter", data, id)
};
const updateExamService = async (id: any, data: any): Promise<any> => {
    return executeOrgStructureProcedureForUpdation("update_exam", data, id)
};

const updateUserService = async (id: any, data: any): Promise<any> => {
    try {
        // UPDATE student SET 
        //         // BATCHID = :BATCHID,
        //         NAME = :NAME,
        //         // ENTRYDATE = :ENTRYDATE,
        //         // EXPIRYDATE = :EXPIRYDATE,
        //         // TRAININGSTARTDATE = :TRAININGSTARTDATE,
        //         // TRAININGENDDATE = :TRAININGENDDATE,
        //         // TCCDATE = :TCCDATE,
        //         // COURSEID = :COURSEID,
        //         // BRANCH = :BRANCH,
        //         CITY = :CITY,
        //         STATE = :STATE,
        //         // SPONSOR = :SPONSOR,
        //         EMAILID = :EMAILID,
        //         MOBILENO = :MOBILENO,
        //         // REFFEREDBY = :REFFEREDBY,
        //         // APPLICATIONNO = :APPLICATIONNO,
        //         // CERTIFICATENO = :CERTIFICATENO,
        //         // IPM = :IPM,
        //     WHERE LOGINID = :STUDENTID or URNNO=:URNNO
        const result = await sequelize.query(
            `UPDATE student SET 
                NAME = :NAME,
                CITY = :CITY,
                STATE = :STATE,
                EMAILID = :EMAILID,
                MOBILENO = :MOBILENO
            WHERE LOGINID = :LOGINID or URNNO=:URNNO AND ROLE='USER'`,
            {
                replacements: {
                    LOGINID: id,
                    URNNO: id,
                    // BATCHID: data.BATCHID,
                    // LOGINID: data.LOGINID,
                    // URNNO: data.URNNO,
                    // PASSWORD: data.PASSWORD,
                    // DPASSWORD: data.DPASSWORD,
                    NAME: data.name,
                    // ENTRYDATE: data.ENTRYDATE,
                    // // EXPIRYDATE: data.EXPIRYDATE,
                    // TRAININGSTARTDATE: data.TRAININGSTARTDATE,
                    // TRAININGENDDATE: data.TRAININGENDDATE,
                    // TCCDATE: data.TCCDATE,
                    // ROLE: data.ROLE,

                    // COURSEID: data.COURSEID,
                    // BRANCH: data.BRANCH,
                    CITY: data.city,
                    STATE: data.state,
                    // SPONSOR: data.SPONSOR,
                    EMAILID: data.email,
                    MOBILENO: data.mobile,
                    // REFFEREDBY: data.REFFEREDBY,
                    // APPLICATIONNO: data.APPLICATIONNO,
                    // CODE: data.CODE,
                    // ACODE: data.ACODE,
                    // LOGINS: data.LOGINS,
                    // CERTIFICATENO: data.CERTIFICATENO,
                    // IPM: data.IPM || 'N',  // If IPM is not provided, default it to 'N'
                    // CREATEDBY: data.CREATEDBY
                },
                type: QueryTypes.UPDATE
            });

        return result;
    } catch (error: any) {
        throw new AppError(error.message, 400)
    }
};


// ----------------Delete services----------------

const deleteCourseService = async (id: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {

        // Deleting all the exams questions  related to a chapters
        await sequelize.query(
            `DELETE q
        FROM ORGSTRUCTURE eq1
        JOIN ORGSTRUCTURE os2 ON eq1.PARENTKEY = os2.ORGSTRUCTUREID
        JOIN EXAMQUESTION q on q.EXAMID=eq1.ORGSTRUCTUREID
        where os2.PARENTKEY = :courseId;`,
            {
                replacements: { courseId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );
        //  Deleting all the exams related to a chapter
        await sequelize.query(
            `DELETE eq1
        FROM ORGSTRUCTURE eq1
        JOIN ORGSTRUCTURE os2 ON eq1.PARENTKEY = os2.ORGSTRUCTUREID
        where os2.PARENTKEY = :courseId;`,
            {
                replacements: { courseId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );
        //Deleting PDF paths from db related to chapter
        await sequelize.query(
            `DELETE cs1
        FROM CONTENTSTATIC cs1
        JOIN ORGSTRUCTURE os2 ON cs1.ORGSTRUCTUREID = os2.ORGSTRUCTUREID
        where os2.PARENTKEY = :courseId;`,
            {
                replacements: { courseId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );

        //Deleting PDF files/folder related to chapter
        const chapterids = await sequelize.query(
            `select ORGSTRUCTUREID from ORGSTRUCTURE where PARENTKEY = :courseId;`,
            {
                replacements: { courseId: id },
                type: QueryTypes.SELECT,
                transaction,
            }
        );
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        chapterids.map((id: any) => {
            if (fs.existsSync(`${process.env.content_path}/pdf/${id.ORGSTRUCTUREID}`)) {
                fs.rename(`${process.env.content_path}/pdf/${id.ORGSTRUCTUREID}`, `${process.env.content_path}/pdf/${id.ORGSTRUCTUREID}-deleted-${timestamp}`, (err) => {
                    if (err) throw err;
                });
            }

        })
        // Deleting the chapters related to the course
        await sequelize.query(
            `DELETE FROM ORGSTRUCTURE WHERE GROUPTYPE = 'CHAPTER' AND PARENTKEY = :courseId`,
            {
                replacements: { courseId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );

        // Finally Deleting the course
        await sequelize.query(
            `DELETE FROM ORGSTRUCTURE WHERE ORGSTRUCTUREID = :courseId`,
            {
                replacements: { courseId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );


        await transaction.commit();
        return { status: 1, message: "Course deleted successfully" };
    } catch (err) {
        await transaction.rollback();
        console.error('Error deleting course:', err);
        throw new Error('Failed to delete course');
    }
};

const deleteChapterService = async (id: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
        // Deleting all the exam questions related to a chapter

        await sequelize.query(
            `DELETE eq1
        FROM EXAMQUESTION eq1
        JOIN ORGSTRUCTURE os2 ON eq1.EXAMID = os2.ORGSTRUCTUREID
        where os2.PARENTKEY = :chapterId;`,
            {
                replacements: { chapterId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );
        //Deleting PDFs related to chapter
        await sequelize.query(
            `DELETE FROM CONTENTSTATIC WHERE ORGSTRUCTUREID = :chapterId;`,
            {
                replacements: { chapterId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );
        // Deleting the exam related to the chapter
        await sequelize.query(
            `DELETE FROM ORGSTRUCTURE WHERE GROUPTYPE = 'EXAM' AND PARENTKEY = :chapterId`,
            {
                replacements: { chapterId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );

        // Deleting the chapter
        const result = await sequelize.query(
            `DELETE FROM ORGSTRUCTURE WHERE ORGSTRUCTUREID = :chapterId`,
            {
                replacements: { chapterId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );

        // Deleting chapter folder 
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        if (fs.existsSync(`${process.env.content_path}/pdf/${id}`)) {
            fs.rename(`${process.env.content_path}/pdf/${id}`, `${process.env.content_path}/pdf/${id}-deleted-${timestamp}`, (err) => {
                if (err) throw err;
            });
        }


        await transaction.commit();
        return { status: 1, message: "Chapter deleted successfully" };
    } catch (err) {
        await transaction.rollback();
        console.error('Error deleting chapter:', err);
        throw new Error('Failed to delete chapter');
    }
};

const deleteExamService = async (id: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
        // First DELETE
        await sequelize.query(
            `DELETE FROM ORGSTRUCTURE WHERE GROUPTYPE = 'EXAM' AND ORGSTRUCTUREID = :examId`,
            {
                replacements: { examId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );

        // Second DELETE
        await sequelize.query(
            `DELETE FROM EXAMQUESTION WHERE EXAMID = :examId`,
            {
                replacements: { examId: id },
                type: QueryTypes.DELETE,
                transaction,
            }
        );

        await transaction.commit();
        return { status: 1, message: "Exam deleted successfully" };
    } catch (err) {
        await transaction.rollback();
        console.error('Error Exam chapter:', err);
        throw new Error('Failed to delete Exam');
    }
};

const getbatch = async (course: any, sponsor: any): Promise<any> => {
    let res: any = [];
    try {

        return await sequelize.query(`select * from BATCHDETAILS where COURSEID = ${course} and COMPANYID = ${sponsor} order by CREATEDON desc`, {

            type: QueryTypes.SELECT

        });

    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const s_getByRole = async (data: any): Promise<any> => {
    try {
        const result = await sequelize.query(`
            CALL sp_getByRole(:role)`,
            {
                replacements: {
                    role: data
                },
                type: QueryTypes.RAW, // Use RAW for stored procedure calls
            }
        );
        // console.log(result)
        return result;
    }
    catch (err) {
        console.log(err)
        let er: any = err;
        throw er;
    }

};

const getExamQuestionService = async (examId: number): Promise<any> => {
    let res: any = [];
    try {

        //// debugger

        return await sequelize.query(`select QUESTIONID,QUESTIONTEXT,ANSWERTEXT,ANSWERTEXT1,ANSWERTEXT2,ANSWERTEXT3,CORRECTANSWER 
            from EXAMQUESTION where EXAMID=${examId}`, {
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

// ------Bulk upload services-------
const bulkUploadUserDataService = async (data: Array<Object>, course_id: any, sponsor_id: any, batch_name: any): Promise<any> => {
    try {
        // Convert the array of objects to a JSON string
        const jsonData = JSON.stringify(data);
        // Call the stored procedure
        const result = await sequelize.query(
            `CALL sp_bulkUploadUser(:bulkData,:courseid,:sponsorid,:batchname)`,
            {
                replacements: {
                    bulkData: jsonData, // Pass JSON string
                    courseid: course_id,
                    sponsorid: sponsor_id,
                    batchname: batch_name,

                },
                type: QueryTypes.RAW,
            }
        );

        return result;
    } catch (err) {
        console.error("Error in Bulk upload user service", err);
        throw err;
    }
};

const bulkUploadExamQuestionsDataService = async (data: Array<Object>, exam_id: any): Promise<any> => {
    try {
        // Convert the array of objects to a JSON string
        const jsonData = JSON.stringify(data);
        // Call the stored procedure
        const result = await sequelize.query(
            `CALL sp_bulkUploadExamQuestion(:bulkData,:examId)`,
            {
                replacements: {
                    bulkData: jsonData, // Pass JSON string
                    examId: exam_id
                },
                type: QueryTypes.RAW,
            }
        );

        return result;
    } catch (err) {
        console.error("Error in Bulk upload user service", err);
        throw err;
    }
};

const getUserForUpdateService = async (id: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `SELECT STUDENTID,BATCHID,COURSEID,URNNO,NAME,CITY,STATE,EMAILID,MOBILENO,REFFEREDBY,APPLICATIONNO,CODE from student
            WHERE LOGINID = :LOGINID or URNNO=:URNNO or EMAILID=:EMAILID OR MOBILENO=:MOBILENO and role='USER'`,
            {
                replacements: {
                    LOGINID: id,
                    URNNO: id,
                    EMAILID: id,
                    MOBILENO: id
                },
                type: QueryTypes.SELECT
            });

        return result;
    } catch (error: any) {
        throw new AppError(error.message, 400)
    }
};

const createNewCompanyService = async (data: any): Promise<any> => {
    let res: any = [];
    try {


        const result = await sequelize.query("insert into companydetails(COMPANYNAME,COMPANYALIAS,COMPANYTYPE) values(:COMPANYNAME,:COMPANYALIAS,:COMPANYTYPE)", {
            replacements: {
                COMPANYNAME: data.company_name,
                COMPANYALIAS: data.alias,
                COMPANYTYPE: data.type
            }
        });
        return result

    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const updateCompanyService = async (id: any, data: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `UPDATE companydetails SET 
                COMPANYNAME = :COMPANYNAME,
                COMPANYALIAS = :COMPANYALIAS,
                COMPANYTYPE = :COMPANYTYPE
            WHERE ID = :ID`,
            {
                replacements: {
                    COMPANYNAME: data.name,
                    COMPANYALIAS: data.alias,
                    COMPANYTYPE: data.type,
                    ID: id
                },
                type: QueryTypes.UPDATE
            });

        return result;
    } catch (error: any) {
        throw new AppError(error.message, 400)
    }
};

const deleteCompanyService = async (id: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `delete from companydetails 
            WHERE ID = :ID`,
            {
                replacements: {
                    ID: id
                },
                type: QueryTypes.DELETE
            });

        return result;
    } catch (error: any) {
        throw new AppError(error.message, 400)
    }
};
const getAllCompanyService = async (): Promise<any> => {
    try {
        const result = await sequelize.query(
            `select * from companydetails`,
            {

                type: QueryTypes.SELECT
            });

        return result;
    } catch (error: any) {
        throw new AppError(error.message, 400)
    }
};
const getCompanyService = async (id: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `select * from companydetails where ID=:ID`,
            {
                replacements: {
                    ID: id
                },
                type: QueryTypes.SELECT
            });

        return result;
    } catch (error: any) {
        throw new AppError(error.message, 400)
    }
};

const chapertsummary = async (chapterid: any): Promise<any> => {
    let userList: any = [];

    const action = 'I';

    try {
        // // Call the stored procedure
        // await sequelize.query(`CALL addchaptertime(:chapterid)`, {
        //     replacements: {
        //         chapterid,
        //     }
        // });



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


//#region  GLOSSARY
const s_addGlossary = async (data: any): Promise<any> => {
    // let glossaryList: any = [];
    try {
        const glossary: any = await sequelize.query(`INSERT INTO tbl_Glossary
            (term,definition,createdBy)
            VALUES(:term,:definition,:createdBy);`, {
            replacements: {
                term: data.term,
                definition: data.definition,
                createdBy: data.createdBy
            },
            type: QueryTypes.INSERT
        });
        return glossary;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const s_updateGlossary = async (data: any): Promise<any> => {
    // let glossaryList: any = [];
    try {
        const glossary: any = await sequelize.query(`UPDATE tbl_Glossary
            SET term = :term,definition = :definition, createdBy =:createdBy WHERE glossary_id = :glossary_id;`, {
            replacements: {
                term: data.term,
                definition: data.definition,
                createdBy: data.createdBy,
                glossary_id: data.glossaryId
            },
            type: QueryTypes.RAW
        });
        return glossary[0].affectedRows;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const s_removeGlossary = async (glossaryId: number): Promise<any> => {
    // let glossaryList: any = [];
    try {
        const glossary: any = await sequelize.query(`DELETE FROM tbl_Glossary WHERE glossary_id = :glossary_id`, {
            replacements: {
                glossary_id: glossaryId
            },
            type: QueryTypes.RAW
        });
        return glossary[0].affectedRows;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};
//#endregion


//#region KMS Integration
const getJourneyData = async (
    JourneyStatus: string,
    JourneyType: string,
    kmsToken: string
): Promise<any> => {
    try {
        let faqList: any = [];
        const url = 'https://engagelybots.ai/dmp_backend/journeydata';

        const requestBody = {
            Journey_Status: JourneyStatus,
            Journey_Type: JourneyType,
            search_for: "",
            search_in: "All"
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${kmsToken}`
        };

        await axios.post(url, requestBody, { headers: headers })
            .then(response => {
                // console.log('Response:', response.data.data);
                faqList = response.data.data;
                // console.log("result : ", faqList);

            })
            .catch(error => {
                let er: any = error;
                throw er;
            });

        // console.log("kms result ", result.data);
        return faqList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getBotData = async (
    kmsToken: string
): Promise<any> => {
    try {
        let botlist: any;
        const url = 'https://webbuilder.engagelybots.ai/nc-api/v1/user/profile-with-auth';

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${kmsToken}`
        };
        await axios.get(url,  { headers: headers })
            .then(response => {
                botlist = response.data?.user_data.BotId
            })
            .catch(error => {
                console.log("KMS Api err",error);
                
                let er: any = error;
                throw er;
            });
        return {data:botlist};
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getJourneyDetail = async (
    JourneyStatus: string,
    JourneyID: string,
    kmsToken: string
): Promise<any> => {
    try {
        let faqList: any = [];
        const url = 'https://engagelybots.ai/dmp_backend/faqjourneydata';

        const requestBody = {
            Journey_ID: JourneyID,
            Journey_Status: JourneyStatus,
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${kmsToken}`
        };

        await axios.post(url, requestBody, { headers: headers })
            .then(response => {
                // console.log('Response:', response.data.data);
                faqList = response.data.data;
                // console.log("result : ", faqList);

            })
            .catch(error => {
                let er: any = error;
                throw er;
            });

        // console.log("kms result ", result.data);
        return faqList;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

function parseTableOfContents(toc: string): string[] {
    // Split the string by newline characters, remove any empty lines, and then remove the numbering (e.g., "1.", "2.", etc.)
    return toc
      .split('\n') // Split the string into an array by newline
      .filter(line => line.trim() !== '') // Remove empty lines
      .map(line => line.replace(/^\d+\.\s*/, '').trim()); // Remove numbers and any leading spaces
  } 

const createCourseByFaq = async (
    JourneyIDs: string[],
    botID : string
): Promise<any> => {
    try {
        let faqList : any = [];
        const url = 'https://engagelybots.ai/lms/create_content';

        const requestBody = {
            journey_ids: JourneyIDs,
            bot_id : botID
        };

        const headers = {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${kmsToken}`
        };
        console.log("KMS API Calling... ");
        setInterval(() => {
            console.log('30 seconds passed');            
        }, 30000);
        
        await axios.post(url, requestBody, { headers: headers })
            .then(response => {
                const content = response.data.Output;
                // console.log('API Response:', content.table_of_content);
                // let tableOfContents = content.table_of_content;
                // let contents = content.table_of_content;
                let keys : string[] = content.table_of_content.split('\n')
                let contentList : string[] = parseTableOfContents(content.table_of_content);
                // console.log(contentList);
                // faqList = contentList;
                
                
                for (let index = 1; index < contentList.length; index++) {
                    faqList.push({
                        title: contentList[index],
                        content: content[keys[index+1]]
                    }
                    )
                    // console.log("faqlist",faqList);
                    
                    
                }
                // console.log("result : ", faqList);

            })
            .catch(error => {
                console.log("kms api err", error);
                
                let er: any = error;
                throw er;
            });

        // console.log("kms result ", result.data);
        return faqList;
    }
    catch (err) {
        console.log(err);
        
        let er: any = err;
        throw er;
    }
};


const createFaqChapter = async (
    chapterContent:any[],
    org_id : string
): Promise<any> => {
    try{
        let sequence: number = await getNextSequence(org_id);
        const pageCount = chapterContent.length;
        let splitFilePaths : string[] = [];
        console.log("in service for page:",pageCount,sequence);
        

        // Directory to save the single-page PDFs
        const environment = process.env.NODE_ENV
        const splitDir=  `${process.env.content_path}`// "D://project//new_lms_backend//CONTENT"; //`${process.env.content_path}`
            // console.log(process.env.NODE_ENV)
        if (!fs.existsSync(splitDir)) {
            console.log("making directory");
            
            fs.mkdirSync(splitDir);
        }

        for (let index = 0; index < pageCount; index++) {

            console.log("loop index =",index, "  seq=", sequence);
            
            // const orgFiles = path.join(splitDir, "PDF", org_id)
            const orgFiles=`${splitDir}//PDF//${org_id}`
            if (!fs.existsSync(orgFiles)) {
                fs.mkdirSync(orgFiles);
            }
            const splitFilePath = path.join(orgFiles, `${sequence ? (sequence + index + 1) : index + 1}.pdf`);
            await createPdf(chapterContent[0].title,chapterContent[0].content,splitFilePath)
            const relativePath = `PDF//${org_id}//${sequence ? (sequence+ index + 1) : index + 1}.pdf`
            //  path.join(`PDF`, org_id, `${sequence ? sequence + 1 : index + 1}.pdf`);
            
            splitFilePaths.push(relativePath);
            console.log(`PDF page ${index+1} created at ${splitFilePath}`);    
        }


    

    let data = splitFilePaths.map((item: any, index: number) => {
        return {
            ORGSTRUCTUREID: org_id,
            CONTENT: `CO${org_id}`,
            SEQUENCE: sequence ? (sequence + index + 1) : index + 1,
            RECORDED: 'Y',
            IMAGEPATH: 'Y',
            TIMED: 'Y',
            HEADER: 'AB',
            FOOTER: 'CH1',
            HEADER1: 'AB',
            HEADER2: 'AB',
            CONTENTPATH: item,
        }
    });

    // save to db
    const result = await uploadPdfService(data);
    return result;
}
    catch (err) {
        console.log(err);
        
        let er: any = err;
        throw er;
    }
};
//#endregion

export default {

    registerbatch,
    registeruser,
    journeydata,
    viewUploadedData,
    verifyUploadedData,
    updateReadingData,
    checkmeterreading,
    sponsor,
    course,
    chapter,
    getbatchname,
    uploadPdfService,
    addNewCourseService,
    addNewChapterService,
    addNewExamService,
    createnewuser,
    addNewQuestionService,
    getuser,
    getbatch,
    s_getByRole,
    activateuser,
    updateuser,
    uploadVideoService,
    updateCourseService,
    updateChapterService,
    deleteCourseService,
    getExamQuestionService,
    deleteChapterService,
    bulkUploadUserDataService,
    bulkUploadExamQuestionsDataService,
    deleteExamService,
    updateExamService,
    updateUserService,
    getUserForUpdateService,
    createNewCompanyService,
    updateCompanyService,
    deleteCompanyService,
    getAllCompanyService,
    getCompanyService,
    chapertsummary,
    s_addGlossary,
    s_removeGlossary,
    s_updateGlossary,
    getJourneyData,
    getJourneyDetail,
    createCourseByFaq,
    getBotData,
    createFaqChapter,
    getAsignCourseAll,
    getAsignCourseByStudentId,
    asignCourse,
    updateAsignCourse,
    removeAsignCourse,
    getPreRequisitesAll,
    getPreRequisitesByCourseId,
    addPreRequisites,
    updatePreRequisites,
    removePreRequisites,
    getUsersAll,
    getStudentsByCourseId

}
