import { Router } from "express";
import user from "../controllers/userController";


import common from "../controllers/commonController";
import authToken from "../_middlewares/authToken";
import payload from "../controllers/Payload";



const router = Router();
router.post('/studentsummary', user.studentsummary);
router.post('/coursesummary', user.coursesummary);
router.post('/chapertsummary', user.chapertsummary);
router.post('/addchaperttime', user.addchaperttime);
router.post('/testsummary', user.testsummary);
router.post('/updatetestanswer', user.updatetestanswer);
router.post('/examresultsummary', user.ExamResultSummary);
router.post('/examresultdetail', user.ExamResultDetail);
router.post('/getchapteruses', user.ChapterUses);
router.post('/getdailytimelimit', user.GetDailyTimeLimit);
router.get('/getGlossary', user.c_getGlossary);


//  below route delete
router.post('/register', user.register);
router.post('/account', user.accountregister);






//---------------------------------------------------------






export default router;