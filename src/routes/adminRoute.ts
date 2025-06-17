import { Router } from "express";
import admin from "../controllers/adminController";
import { SchemaValidator } from "../_middlewares/validateSchema";
import multer from "multer";
import { upload } from "../_configs/multerconfig"
// Initialize Multer for file uploads
const validateSchema = SchemaValidator(true);

const router = Router();
router.post('/uploadeddata', admin.viewUploadedData);
router.post('/uploadedVerifydata', admin.verifyuploaddata);
router.post('/updatemeterreading', admin.updateReadingData);
router.post('/checkmeterreading', admin.checkmeterreading);
router.post('/registeruser', admin.registeruser);
router.post('/journeydata', admin.journeydata);
router.post('/createbatch', admin.registerbatch);
router.post('/createnewuser', admin.createnewuser);
router.get('/getsponsor', admin.sponsor);
router.get('/getcourse', admin.course);
router.post('/getbatchname', admin.getbatchname);
router.post('/upload', upload.single('file'), admin.uploadPdf);
router.post('/course/new', admin.addNewCourse);
router.post('/chapter/new', admin.addNewChapter);
router.post('/exam/new', admin.addNewExam);
router.get('/getchapter/:courseid', admin.chapter);
router.post('/question/new', admin.addNewQuestion);
router.get('/getuser/:firstuser/:lastuser', admin.getuser);
router.post('/activateuser', admin.activateuser);
router.post('/updateuser', admin.updateuser);
router.get('/getbatch/:course/:sponsor', admin.getbatch);
router.get('/getByRole/:role', admin.c_getByRole);
router.get('/exam/:id/questions', admin.getExamQuestions);
// router.get('/getByRole/:role/', admin.);


// GLOSSARY
router.post('/add-glossary', admin.c_addGlossary);
router.put('/update-glossary', admin.c_updateGlossary);
router.delete('/delete-glossary/:id', admin.c_removeGlossary);

router.post('/company/new', admin.addNewCompany);
router.patch('/company/update/:id', admin.updateCompany);
router.delete('/company/delete/:id', admin.deleteCompany);
router.get('/company/get-all', admin.getAllCompanies);

router.get('/company/get/:id', admin.getCompany);



router.get('/user/:id', admin.getUserForUpdate);


// Update routes---------------------------------------------------------
router.patch('/course/update/:id', admin.updateCourse);
router.patch('/chapter/update/:id', admin.updateChapter);
router.patch('/exam/update/:id', admin.updateExam);
router.patch('/user/update/:id', admin.updateUser);

// Delete routes---------------------------------------------------------
router.delete('/course/delete/:id', admin.deleteCourse);
router.delete('/chapter/delete/:id', admin.deleteChapter);
router.delete('/exam/delete/:id', admin.deleteExam);



//Bulk upload
router.post('/upload/user-data', upload.single('file'), admin.bulkUploadUserData);
router.post('/upload/exam-data', upload.single('file'), admin.bulkUploadExamQuestionsData);

router.get('/chapertsummary/:id', admin.chapertsummary);

// KMS INTEGRATION

//test comment
router.post('/KMS/journey-data', admin.fetchJourneyData);
router.post('/KMS/journey-detail', admin.fetchJourneyDetail);
router.post('/KMS/stage-chapter', admin.getCourseByFaq);
router.post('/KMS/fetch-bots-detail', admin.fetchBots);
router.post('/KMS/create-chapter-by-faq', admin.createChapterByFaq);

// ASIGN COURSE
router.get('/get-all-asign-course', admin.getAsignCourseAll);
router.post('/get-student-asign-course', admin.getAsignCourseByStudentId);
router.post('/add-asign-course', admin.asignCourse);
router.post('/update-asign-course', admin.updateAsignCourse);
router.post('/remove-asign-course', admin.removeAsignCourse);
router.post('/get-course-students', admin.getStudentsByCourseId);


// Pre Requisities
router.get('/get-all-pre-requisities', admin.getPreRequisitiesAll);
router.post('/get-course-pre-requisities', admin.getPreRequisitiesByCourseId);
router.post('/add-pre-requisities', admin.addPreRequisities);
router.post('/update-pre-requisities', admin.updatePreRequisities);
router.post('/remove-pre-requisities', admin.removePreRequisities);

router.post('/get-all-users', admin.getUsersAll);










export default router;