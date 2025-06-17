import { ErrorRequestHandler, RequestHandler } from "express";
import queAnsService from '../_services/queAnsService';
import createHttpError from "http-errors";
import response from "../_middlewares/response";
import { messaging } from "firebase-admin";
import { AppError } from "../helpers/customError";
import { sendSuccessResponse } from "../helpers/successResponse";

const addQuestion: RequestHandler = async (req, res, next) => {
    try {
        //// debugger
        const { question } = req.body;
        const userId: string = req.header('Data') as string;

        if (userId == undefined || question == undefined) {
            throw new AppError("userId or question is required", 400)

        }
        let result: any = await queAnsService.queryQuestion(question, userId)

        let questionDeatil: any = result
        sendSuccessResponse(res, 'Question added successfully', questionDeatil)
    }
    catch (error: any) {
        return next(new AppError(error.message, 400));
    }

};

const getAnsweredQuestions: RequestHandler = async (req, res, next) => {
    try {
        const userId: string = req.header('Data') as string;
        if (userId == undefined) {
            throw new AppError("userId or question is required", 400)
        }
        let result: any = await queAnsService.getAnsweredTutorQuery(userId)
        let questionDeatil: any = result.map((result: any) => {
            return {
                QuestionId: result.qaId,
                Question: result.question,
                Answer: result.answer,
                AnsweredOn: result.answerDate,
                AskBy: result.NAME,
                StuId: result.studentId,
                AskedOn: result.createdAt
            }
        });
        sendSuccessResponse(res, '', questionDeatil)

    }
    catch (err) {
        let er: any = err;
        next(new AppError(er.message, 400));
    }
};

const getUnansweredQuestions: RequestHandler = async (req, res, next) => {
    try {
        const userId: string = req.header('Data') as string;
        if (userId == undefined) {
            throw new AppError("userId or question is required", 400)
        }
        let result: any = await queAnsService.getUnansweredTutorQuery(userId)
        let questionDeatil: any = result.map((result: any) => {
            return {
                QuestionId: result.qaId,
                Question: result.question,
                AskBy: result.NAME,
                StuId: result.studentId,
                AskedOn: result.createdAt
            }
        });
        sendSuccessResponse(res, '', questionDeatil)
    }
    catch (err) {
        let er: any = err;
        next(new AppError(er.message, 400));
    }
};

const giveQueryAnswer: RequestHandler = async (req, res, next) => {
    try {
        const userId: string = req.header('Data') as string;
        if (userId == undefined || req.body.questionId == undefined || req.body.answer == undefined) {
            throw new AppError("userId, questionId and answer is required", 400)
        }
        let result: any = await queAnsService.answerQuery(userId, req.body.answer, req.body.questionId)
        let questionDeatil: any = result;
        sendSuccessResponse(res, '', questionDeatil)
    }
    catch (err) {
        let er: any = err;
        next(new AppError(er.message, 400));
    }
};


const getAllQuestions: RequestHandler = async (req, res, next) => {
    try {
        const userId: string = req.header('Data') as string;
        if (userId == undefined) {
            throw new AppError("userId or question is required", 400)
        }
        let result: any = await queAnsService.getAllTutorQuery(userId)
        // console.log("result",result);

        let questionDeatil: any = result.map((result: any) => {
            return {
                QuestionId: result.qaId,
                Question: result.question,
                Answer: result.answer,
                AnsweredOn: result.answerDate,
                AskBy: result.NAME,
                StuId: result.studentId,
                AskedOn: result.createdAt
            }
        });

        sendSuccessResponse(res, '', questionDeatil)
    }
    catch (err) {
        let er: any = err;
        next(new AppError(er.message, 400));
    }
};

const getAllStuQuestions: RequestHandler = async (req, res, next) => {
    try {
        const userId: any = req.header('Data') as string;
        if (userId == undefined) {
            throw new AppError("userId or question is required", 400)
        }
        let result: any = await queAnsService.getAllStuQuery(userId)
        // console.log("result",result);

        let questionDeatil: any = result.map((result: any) => {
            return {
                QuestionId: result.qaId,
                TutorId: result.tutorURN,
                Question: result.question,
                Answer: result.answer,
                AnsweredOn: result.answerDate,
                AskBy: result.NAME,
                StuId: result.studentId,
                AskedOn: result.createdAt
            }
        });

        sendSuccessResponse(res, '', questionDeatil)
    }
    catch (err) {
        let er: any = err;
        next(new AppError(er.message, 400));
    }
};


export default {
    addQuestion,
    getAnsweredQuestions,
    getUnansweredQuestions,
    getAllQuestions,
    giveQueryAnswer,
    getAllStuQuestions
}


