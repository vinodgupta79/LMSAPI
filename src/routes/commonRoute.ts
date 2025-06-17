import express, { Router } from "express";
import common from "../controllers/commonController";
import payload from "../controllers/Payload";
import path from 'path';
import authToken from "../_middlewares/authToken";

const router = Router();


//router.post('/viewregister', common.Viewregister);
router.post('/beneficiaryr', common.beneficiaryR);
router.post('/signin', common.signin);
router.post('/checkauth', common.checkauth);






//router.post('/Createorder', common.createorder);













export default router;