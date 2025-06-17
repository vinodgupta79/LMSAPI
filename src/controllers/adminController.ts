import { ErrorRequestHandler, RequestHandler } from "express";
import adminService from '../_services/adminService';
import createHttpError from "http-errors";
import response from "../_middlewares/response";
import splitPDF from "../_services/pdfSplitter";
import { getNextSequence } from "../_services/getNextSequence";
import path from "path";
import XLSX from 'xlsx';
import { createPdf } from '../_services/pdfMaker';
import { AppError } from '../helpers/customError';
import { createHandler, deletehandler, updateHandler } from "../helpers/requrestHandler";
import { sendSuccessResponse } from "../helpers/successResponse";
import { AnyARecord } from "dns";
import { messaging } from "firebase-admin";
function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const viewUploadedData: RequestHandler = async (req, res, next) => {
    try {
        //// debugger

        let result: any = await adminService.viewUploadedData(req.body.userId)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const verifyuploaddata: RequestHandler = async (req, res, next) => {
    try {
        // debugger

        let result: any = await adminService.verifyUploadedData(req.body.userId)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const updateReadingData: RequestHandler = async (req, res, next) => {
    try {
        // debugger

        let result: any = await adminService.updateReadingData(req.body.taskid, req.body.readingdata)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const checkmeterreading: RequestHandler = async (req, res, next) => {
    try {
        // debugger

        let result: any = await adminService.checkmeterreading(req.body.taskid, req.body.verify, req.body.remark)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const journeydata: RequestHandler = async (req, res, next) => {
    try {
        debugger

        let result: any = await adminService.journeydata(req.body.headerdata)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const registeruser: RequestHandler = async (req, res, next) => {
    try {
        // debugger

        let result: any = await adminService.registeruser(req.body.name, req.body.mobuile, req.body.emailid)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const registerbatch: RequestHandler = async (req, res, next) => {
    try {
        // debugger

        let userid: any = req.headers.data ?? "";

        let result: any = await adminService.registerbatch(req.body.courseid, req.body.companyid, userid, req.body.batchsize)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const createnewuser: RequestHandler = async (req, res, next) => {
    try {
        //// debugger

        let userid: any = 'ADMIN';//req.headers.data ?? "";

        let result: any = await adminService.createnewuser(req.body.courseid, req.body.companyid, userid, req.body.batchname, req.body.noofuser)

        let changeDetail: any = result;
        sendSuccessResponse(res, '', changeDetail)

    }
    catch (err) {
        let er: any = err;
        return next(new AppError(er.message, 400));
    }

};

const sponsor: RequestHandler = async (req, res, next) => {
    try {
        //// debugger

        let result: any = await adminService.sponsor()

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const course: RequestHandler = async (req, res, next) => {
    try {
        //// debugger

        let result: any = await adminService.course()

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const chapter: RequestHandler = async (req, res, next) => {
    try {
        // console.log(" cntrl run");

        // Extract courseId from request parameters (adjust based on where courseId comes from)
        const { courseid } = req.params; // Or req.query/courseId or req.body.courseId, based on your API design

        if (!courseid) {
            return next(createHttpError(400, 'courseId is required')); // Handle missing courseId
        }

        // Call adminService.course with courseId
        const result: any = await adminService.chapter(courseid);
        // console.log("result ", result);

        const changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));
    } catch (err) {
        const er: any = err;
        next(createHttpError(500, er.message));
    }
};

const getbatchname: RequestHandler = async (req, res, next) => {
    try {
        //// debugger

        let result: any = await adminService.getbatchname(req.body.courseid, req.body.companyid)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const uploadPdf: RequestHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('No file provided', 400));
        }
        const { org_id } = req.body

        const filePath = req.file?.path
        const fileType = req.file?.mimetype
        if (fileType === "application/pdf") {
            const { splitFilePaths, seq: sequence } = await splitPDF(filePath, org_id)
            const data = splitFilePaths.map((item: any, index: number) => {
                return {
                    ORGSTRUCTUREID: org_id,
                    CONTENT: `CO${org_id}`,
                    SEQUENCE: sequence ? sequence + index + 1 : index + 1,
                    RECORDED: 'Y',
                    IMAGEPATH: 'Y',
                    TIMED: 'Y',
                    HEADER: 'AB',
                    FOOTER: 'CH1',
                    HEADER1: 'AB',
                    HEADER2: 'AB',
                    CONTENTPATH: item,

                }
            })
            const result = await adminService.uploadPdfService(data)
            sendSuccessResponse(res, '', result);
        }
        else {

            const sequence = await getNextSequence(org_id)
            const data = {
                ORGSTRUCTUREID: org_id,
                CONTENT: `CO${org_id}`,
                SEQUENCE: sequence ? sequence + 1 : 1,
                RECORDED: 'Y',
                IMAGEPATH: 'Y',
                TIMED: 'Y',
                HEADER: 'AB',
                FOOTER: 'CH1',
                HEADER1: 'AB',
                HEADER2: 'AB',
                // CONTENTPATH: `PDF\\${org_id}\\${sequence ? sequence + 1 : 1}.mp4`,
                CONTENTPATH: path.join(`PDF`, org_id, `${sequence ? sequence + 1 : 1}.mp4`)

            }

            const result = await adminService.uploadVideoService(data)
            sendSuccessResponse(res, '', result);
        }



    }
    catch (error: any) {
        return next(new AppError(error.message, 400));
    }

};

const addNewQuestion: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        result = await adminService.addNewQuestionService(req.body);
        sendSuccessResponse(res, '', result);
    } catch (error: any) {
        return next(new AppError(error.message, 400));
    }

};

const getuser: RequestHandler = async (req, res, next) => {
    try {
        //  console.log(" cntrl run");

        // Extract courseId from request parameters (adjust based on where courseId comes from)
        const { firstuser, lastuser } = req.params;

        // Validate that both parameters are provided
        if (!firstuser || !lastuser) {
            return next(createHttpError(400, 'Both firstuser and lastuser are required'));
        }

        // Call adminService.course with courseId
        const result: any = await adminService.getuser(firstuser, lastuser);
        // console.log("result ", result);

        const changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));
    } catch (err) {
        const er: any = err;
        next(createHttpError(500, er.message));
    }
};

const activateuser: RequestHandler = async (req, res, next) => {
    try {


        let result: any = await adminService.activateuser(req.body)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const updateuser: RequestHandler = async (req, res, next) => {
    try {
        // debugger

        let result: any = await adminService.updateuser(req.body)

        let changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));

    }
    catch (err) {
        let er: any = err;
        next(createHttpError('500', er.message));
    }

};

const getExamQuestions: RequestHandler = async (req, res, next) => {
    try {
        const { id: examId } = req.params;
        if (!examId) {
            return next(new AppError("Exam ID is required", 400));
        }
        const result: any = await adminService.getExamQuestionService(Number(examId));
        sendSuccessResponse(res, '', result);
    } catch (error: any) {
        return next(new AppError(error.message, 400));
    }
};

// --------------Create controllers---------------
const addNewCourse = createHandler(adminService.addNewCourseService, "Course")

const addNewChapter = createHandler(adminService.addNewChapterService, "Chapter")

const addNewExam = createHandler(adminService.addNewExamService, "Exam")

// --------------Update controllers---------------
const updateCourse = updateHandler(adminService.updateCourseService, 'Course')

const updateChapter = updateHandler(adminService.updateChapterService, 'Chapter')

const updateExam = updateHandler(adminService.updateExamService, 'Exam')
const updateUser: RequestHandler = async (req, res, next) => {
    try {
        let result: any = await adminService.updateUserService(req.params.id, req.body)
        sendSuccessResponse(res, 'User updated successfully', result);
    }
    catch (err) {
        let er: any = err;
        return next(new AppError(er.message, 400));
    }
}

// --------------Delete controllers---------------
const deleteCourse = deletehandler(adminService.deleteCourseService, 'Course');

const deleteChapter = deletehandler(adminService.deleteChapterService, 'Chapter');
const deleteExam = deletehandler(adminService.deleteExamService, 'Exam');

const getbatch: RequestHandler = async (req, res, next) => {
    try {
        //  console.log(" cntrl run");

        // Extract courseId from request parameters (adjust based on where courseId comes from)
        const { course, sponsor } = req.params;

        // Validate that both parameters are provided
        if (!course || !sponsor) {
            return next(new AppError('Both course and sponsor are required', 400));

        }

        // Call adminService.course with courseId
        const result: any = await adminService.getbatch(course, sponsor);
        // console.log("result ", result);

        const changeDetail: any = result;
        res.status(200).json(response.success(changeDetail));
    } catch (err) {
        const er: any = err;
        return next(new AppError('Internal server error', 500));
    }
};

const c_getByRole: RequestHandler = async (req, res, next) => {

    //// debugger
    let result: any;
    try {
        const role = req.params.role;
        if (!(role === 'TUTOR' || role === 'USER' || role === 'ADMIN')) {
            return next(new AppError('role should be correct', 400));
            // Handle missing courseId
        }
        result = await adminService.s_getByRole(role);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        return next(new AppError('Internal server error', 500));
    }

};

// -------------------Bulk upload controllers--------------------
const bulkUploadUserData: RequestHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('No file provided', 400));
        }
        const { course_id, sponsor_id, batch_name } = req.body
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        // Pass sanitized data to the service
        const result = await adminService.bulkUploadUserDataService(rawData, course_id, sponsor_id, batch_name);

        sendSuccessResponse(res, "User data uploaded successfully", result);
    } catch (err) {
        const error: any = err;
        return next(new AppError(error.message, 400));

    }
    // finally {
    //     if (req.file) {
    //         fs.unlink(req.file.path, (err) => {
    //             if (err) console.error("Error removing file:", err.message);
    //         });
    //     }
    // }
};

const bulkUploadExamQuestionsData: RequestHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('No file provided', 400));
        }
        const { exam_id } = req.body
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const result = await adminService.bulkUploadExamQuestionsDataService(rawData, exam_id);

        sendSuccessResponse(res, "Exam data uploaded successfully", result);
    } catch (err) {
        const error: any = err;
        return next(new AppError(error.message, 400));
    }
    // finally {
    //     if (req.file) {
    //         fs.unlink(req.file.path, (err) => {
    //             if (err) console.error("Error removing file:", err.message);
    //         });
    //     }
    // }
};
const getUserForUpdate: RequestHandler = async (req, res, next) => {
    try {
        let result: any = await adminService.getUserForUpdateService(req.params.id)
        sendSuccessResponse(res, '', result);
    }
    catch (err) {
        let er: any = err;
        return next(new AppError(er.message, 400));
    }
}

const addNewCompany: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        result = await adminService.createNewCompanyService(req.body);
        sendSuccessResponse(res, 'Company created successfully');
    } catch (error: any) {
        return next(new AppError(error.message, 400));
    }

};
const updateCompany: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        result = await adminService.updateCompanyService(req.params.id, req.body);
        sendSuccessResponse(res, 'Company updated successfully');
    } catch (error: any) {
        return next(new AppError(error.message, 400));
    }

};
const deleteCompany: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        result = await adminService.deleteCompanyService(req.params.id);
        sendSuccessResponse(res, 'Company deleted successfully');
    } catch (error: any) {
        return next(new AppError(error.message, 400));
    }

};
const getAllCompanies: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        result = await adminService.getAllCompanyService();
        sendSuccessResponse(res, '', result);
    } catch (error: any) {
        return next(new AppError(error.message, 400));
    }

};

const getCompany: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        result = await adminService.getCompanyService(req.params.id);
        sendSuccessResponse(res, '', result);
    } catch (error: any) {
        return next(new AppError(error.message, 400));
    }

};

const chapertsummary: RequestHandler = async (req, res, next) => {

    // debugger
    let result: any;
    try {
        result = await adminService.chapertsummary(req.params.id,);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

//#region GLOSSARY

const c_addGlossary: RequestHandler = async (req, res, next) => {

    //// debugger
    let result: any;
    try {
        const { term, definition } = req.body;
        const userId: any = req.header('Data') as string;
        if (!userId) {
            return next(createHttpError(400, 'you are logged out')); // Handle missing
        }
        if (!term || !definition) {
            return next(createHttpError(400, 'term and definition are required')); // Handle missing courseId
        }
        const newData = { term, definition, createdBy: userId };
        result = await adminService.s_addGlossary(newData);
        if (result[1] == 1) {
            return res.status(200).json(response.success(`Glossary : ${result[0]} is added successfully`));
        }
        else {
            return next(createHttpError(400, 'Glossary is not added ')); // Handle missing courseId
        }
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const c_updateGlossary: RequestHandler = async (req, res, next) => {

    //// debugger
    let result: any;
    try {
        const { glossaryId, term, definition } = req.body;
        const userId: any = req.header('Data') as string;
        if (!userId) {
            return next(createHttpError(400, 'you are logged out')); // Handle missing
        }
        if (!term || !definition || !glossaryId) {
            return next(createHttpError(400, 'glossaryId,term and definition are required')); // Handle missing courseId
        }
        const updateData = { glossaryId, term, definition, createdBy: userId };
        result = await adminService.s_updateGlossary(updateData);
        // console.log(result);
        if (result == 1) {
            return res.status(200).json(response.success(`Glossary : ${glossaryId} is updated successfully`));
        }
        else {
            return next(createHttpError(400, 'Glossary is not updated ')); // Handle
        }
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const c_removeGlossary: RequestHandler = async (req, res, next) => {

    //// debugger
    let result: any;
    try {
        const glossaryId: any = req.params.id as string;
        const userId: any = req.header('Data') as string;
        if (!userId) {
            return next(createHttpError(400, 'you are logged out')); // Handle missing
        }
        if (!glossaryId || glossaryId === 'undefined') {
            return next(createHttpError(400, 'glossary ID must be in param')); // Handle missing courseId
        }
        result = await adminService.s_removeGlossary(1 * glossaryId);
        if (result == 1) {
            return res.status(200).json(response.success(`Glossary : ${glossaryId} is removed successfully`));
        }
        else {
            return next(createHttpError(400, 'Glossary is not removed ')); // Handl
        }
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

//#endregion

//#region KMS Integration

const fetchJourneyData: RequestHandler = async (req, res, next) => {

    // debugger
    let result: any;
    try {
        const { JourneyStatus, JourneyType, kmsToken } = req.body;
        result = await adminService.getJourneyData(JourneyStatus, JourneyType, kmsToken);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const fetchBots: RequestHandler = async (req, res, next) => {

    // debugger
    let result: any;
    try {
        const {kmsToken } = req.body;
        result = await adminService.getBotData(kmsToken);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const fetchJourneyDetail: RequestHandler = async (req, res, next) => {

    // debugger
    let result: any;
    try {
        const { JourneyStatus, JourneyID, kmsToken } = req.body;
        result = await adminService.getJourneyDetail(JourneyStatus, JourneyID, kmsToken);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const getCourseByFaq: RequestHandler = async (req, res, next) => {

    // debugger
    let result: any;
    try {
        const { JourneyIDs,botID } = req.body;
        result = await adminService.createCourseByFaq(JourneyIDs,botID);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

const createChapterByFaq: RequestHandler = async (req, res, next) => {

    // debugger
    let result: any;
    try {
        const { content, orgId } = req.body;
        result = await adminService.createFaqChapter(content, orgId );
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }

};

//#endregion

//#region  ASIGN COURSE cntrl

const getAsignCourseAll: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        result = await adminService.getAsignCourseAll();
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const getAsignCourseByStudentId: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const {studentId } = req.body;
        result = await adminService.getAsignCourseByStudentId(studentId);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const getStudentsByCourseId: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const {courseId } = req.body;
        result = await adminService.getStudentsByCourseId(courseId);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const asignCourse: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const { courseIds, studentId } = req.body;
        result = await adminService.asignCourse(courseIds, studentId);
        res.status(200).json(response.success({status:"success", message:`Course ${courseIds} asign to student ${studentId}` }));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const updateAsignCourse: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const { courseId, studentId } = req.body;
        result = await adminService.updateAsignCourse(courseId, studentId);
        console.log(result);
        
        res.status(200).json(response.success({status:"success", message : `Course ${courseId} update to student ${studentId}` }));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const removeAsignCourse: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const { studentId ,courseId} = req.body;
        result = await adminService.removeAsignCourse(studentId,courseId);
        res.status(200).json(response.success({status: "success", message: `Course remove to student ${studentId}` }));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};
//#endregion

const getUsersAll: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const {sponsor} = req.body
        if(sponsor===undefined || sponsor===null){
            let err = new Error('sponsor is required')
            throw err;

        }
        result = await adminService.getUsersAll(sponsor);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

//#region  PRE REQUISITIES

const getPreRequisitiesAll: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        result = await adminService.getPreRequisitesAll();
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const getPreRequisitiesByCourseId: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const {courseId } = req.body;
        result = await adminService.getPreRequisitesByCourseId(1*courseId);
        res.status(200).json(response.success(result));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const addPreRequisities: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const { courseId, preRequisities } = req.body;
        result = await adminService.addPreRequisites(courseId, preRequisities);
        res.status(200).json(response.success({
            status:"success", 
            message:`preRequisities ${preRequisities} add to course ${courseId}` 
        }));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const updatePreRequisities: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const { courseId, preRequisities } = req.body;
        result = await adminService.updatePreRequisites(courseId, preRequisities);
        console.log(result);
        
        res.status(200).json(response.success({
            status:"success", 
            message : `preRequisities ${preRequisities} update to course ${courseId}` }));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

const removePreRequisities: RequestHandler = async (req, res, next) => {

    let result: any;
    try {
        const { courseId} = req.body;
        result = await adminService.removePreRequisites(courseId);
        res.status(200).json(response.success({
            status: "success", 
            message: `preRequisities remove to student ${courseId}` }));
    } catch (error) {
        var er: any = error
        next(createHttpError('500', er.message));
    }
};

//#endregion

export default {

    viewUploadedData,
    verifyuploaddata,
    updateReadingData,
    checkmeterreading,
    registeruser,
    journeydata,
    registerbatch,
    sponsor,
    course,
    chapter,
    getbatchname,
    getbatch,
    uploadPdf,
    addNewCourse,
    addNewChapter,
    addNewExam,
    createnewuser,
    addNewQuestion,
    getuser,
    activateuser,
    updateuser,
    updateCourse,
    updateChapter,
    deleteCourse,
    c_getByRole,
    getExamQuestions,
    deleteChapter,
    bulkUploadUserData,
    bulkUploadExamQuestionsData,
    deleteExam,
    updateExam,
    updateUser,
    getUserForUpdate,
    addNewCompany,
    updateCompany,
    deleteCompany,
    getAllCompanies,
    getCompany,
    chapertsummary,
    c_addGlossary,
    c_removeGlossary,
    c_updateGlossary,
    fetchJourneyData,
    fetchJourneyDetail,
    getCourseByFaq,
    fetchBots,
    createChapterByFaq,

    // asign course 
    getAsignCourseAll,
    getAsignCourseByStudentId,
    asignCourse,
    updateAsignCourse,
    removeAsignCourse,
    getStudentsByCourseId,

    // PRE Requisities
    getPreRequisitiesAll,
    getPreRequisitiesByCourseId,
    addPreRequisities,
    updatePreRequisities,
    removePreRequisities,
    getUsersAll
}