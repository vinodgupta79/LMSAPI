import { Router } from "express";
import queAnsController from "../controllers/queAnsController";
// import multer from "multer";
// import multerConfig from "../_configs/multerconfig"
// Initialize Multer for file uploads
// const upload = multer(multerConfig);



const router = Router();
router.post('/student/queryQuestion', queAnsController.addQuestion);
router.get('/tutor/AnsweredQuestions', queAnsController.getAnsweredQuestions);
router.get('/tutor/UnansweredQuestions', queAnsController.getUnansweredQuestions);
router.get('/tutor/AllQuestions', queAnsController.getAllQuestions);
router.post('/tutor/answerQuery', queAnsController.giveQueryAnswer);
router.get('/student/getAnswer', queAnsController.getAllStuQuestions);


//---------------------------------------------------------






export default router;