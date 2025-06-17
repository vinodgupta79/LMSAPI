import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
import constants from '../_dbs/oracle/constants';
// import User from '../_models/user';
// import UserType from '../_models/userType';
import encript from '../_middlewares/encript'
// import axios from 'axios';
var request = require('request');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { baseurl } from '../baseurl'
require('dotenv').config();

const queryQuestion = async (
    question: string,
    stu_urn: string,
    // tutorId: number,
): Promise<any> => {
    let res: any = [];
    try {

        //// debugger
        const result: any = await sequelize.query(`
            INSERT INTO tbl_queAns (question,tutorURN,studentId,answerDate,createdAt)
            VALUES (:question,
            (select tutorURN from BATCHDETAILS WHERE BATCHNAME = 
            (select BATCHID from STUDENT WHERE URNNO = :urn_no ) ) ,
            (SELECT STUDENTID FROM STUDENT WHERE URNNO = :urn_no ),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);`, {
            replacements: {
                urn_no: stu_urn,
                question: question
            },
            type: QueryTypes.INSERT

        });
        res = result[0][0];
        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getAllTutorQuery = async (
    tut_urn: string,
): Promise<any> => {
    let res: any = [];
    try {
        const result: any = await sequelize.query(`SELECT qaId,question,answer,STUDENT.NAME ,tbl_queAns.studentId,createdAt,answerDate 
            from tbl_queAns JOIN STUDENT ON STUDENT.STUDENTID = tbl_queAns.studentId 
            where tutorURN = :tut_urn order by createdAt DESC;`, {
            replacements: {
                tut_urn: tut_urn,
            },
            type: QueryTypes.select
        });
        // console.log("service result",result);

        res = result[0];
        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getAllStuQuery = async (
    stu_ID: string,
): Promise<any> => {
    let res: any = [];
    try {
        const result: any = await sequelize.query(`SELECT qaId,question,answer,STUDENT.NAME ,tbl_queAns.studentId,createdAt,answerDate, 
            tutorURN from tbl_queAns JOIN STUDENT ON STUDENT.STUDENTID = tbl_queAns.studentId 
            where tbl_queAns.studentId = (SELECT STUDENTID FROM STUDENT WHERE URNNO = :urn_no ) order by createdAt DESC`, {
            replacements: {
                urn_no: stu_ID,
            },
            type: QueryTypes.select
        });
        // console.log("service result",result);

        res = result[0];
        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getAnsweredTutorQuery = async (
    tut_urn: string,
): Promise<any> => {
    let res: any = [];
    try {
        const result: any = await sequelize.query(`SELECT qaId,question,answer,STUDENT.NAME ,tbl_queAns.studentId,createdAt,answerDate 
            from tbl_queAns JOIN STUDENT ON STUDENT.STUDENTID = tbl_queAns.studentId 
            where tutorURN = :tut_urn and answer is not null order by createdAt;`, {
            replacements: {
                tut_urn: tut_urn,
            },
            type: QueryTypes.select
        });
        res = result[0];
        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const getUnansweredTutorQuery = async (
    tut_urn: string,
): Promise<any> => {
    let res: any = [];
    try {
        const result: any = await sequelize.query(`SELECT qaId,question,answer,STUDENT.NAME ,tbl_queAns.studentId,createdAt 
            from tbl_queAns JOIN STUDENT ON STUDENT.STUDENTID = tbl_queAns.studentId 
            where tutorURN = :tut_urn and answer is null order by createdAt;`, {
            replacements: {
                tut_urn: tut_urn,
            },
            type: QueryTypes.select
        });
        res = result[0];
        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

const answerQuery = async (
    tut_urn: string,
    answer: string,
    que_ID: number,
): Promise<any> => {
    let res: any = [];
    try {
        const result: any = await sequelize.query(`UPDATE tbl_queAns set answer = :answer  
            where qaId = :qaId and tutorURN = :tut_urn ;`, {
            replacements: {
                tut_urn: tut_urn,
                answer: answer,
                qaId: que_ID
            },
            type: QueryTypes.UPDATE
        });
        res = result[0];
        return res;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }
};

export default {
    queryQuestion,
    getAllTutorQuery,
    getAnsweredTutorQuery,
    getUnansweredTutorQuery,
    answerQuery,
    getAllStuQuery
}