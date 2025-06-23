import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
require('dotenv').config();


export const getReportDataBatchWiseService = async (data: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
        const result = await sequelize.query(
            `call sp_reportByBatch(:inputBatchID,:inputCourseID)`,
            {
                replacements: { inputBatchID: data.batchId, inputCourseID: data.courseId },
                type: QueryTypes.RAW,
            }
        );
        return result
    } catch (err) {
        throw err
    }
};

export const getReportDataDateWiseService = async (data: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
        const result = await sequelize.query(
            `call sp_reportByDate(:entryDate,:expiryDate,:sponsor,:inputCourseID)`,
            {
                replacements: {
                    entryDate: data.entryDate,
                    expiryDate: data.expiryDate,
                    inputCourseID: data.courseId,
                    sponsor : data.sponsor
                },
                type: QueryTypes.RAW,
            }
        );
        return result
    } catch (err) {
        throw err
    }
};

export const getReportDataLoginWiseService = async (data: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
        const result = await sequelize.query(
            `call sp_reportByLogin(:inputId)`,
            {
                replacements: {
                    inputId: data.id
                },
                type: QueryTypes.RAW,
            }
        );
        return result
    } catch (err) {
        throw err
    }
};

export const getReportCompanyWiseService = async (data: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `call sp_reportByCompany(:inputCompanyId)`,
            {
                replacements: {
                    inputCompanyId: data.companyId
                },
                type: QueryTypes.RAW,
            }
        );
        return result
    } catch (err) {
        throw err
    }
};
export const getUserActivityService = async (data: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `call sp_userActivity(:inputId,:inputDate)`,
            {
                replacements: {
                    inputId: data.id,
                    inputDate: data.date
                },
                type: QueryTypes.RAW,
            }
        );
        return result
    } catch (err) {
        throw err
    }
};

export const getUserDailyTimeSpendService = async (data: any): Promise<any> => {
    try {
        const result = await sequelize.query(
            `call sp_userDailyTimeSpend(:inputStudentId)`,
            {
                replacements: {
                    inputStudentId: data.id,
                },
                type: QueryTypes.RAW,
            }
        );
        return result
    } catch (err) {
        throw err
    }
};