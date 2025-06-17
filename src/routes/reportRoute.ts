import { Router } from "express";
import { getReportCompanyWise, getReportDataBatchWise, getReportDataDateWise, getReportDataLoginWise, getUserActivity, getUserDailyTimeSpend } from "../controllers/reportController";

const router = Router();


router.post('/batch-wise', getReportDataBatchWise);

router.post('/date-wise', getReportDataDateWise);

router.post('/company-wise', getReportCompanyWise);


router.post('/login-wise', getReportDataLoginWise);

router.post('/user-activity', getUserActivity);

router.post('/user-daily-time-spend', getUserDailyTimeSpend);


export default router;
