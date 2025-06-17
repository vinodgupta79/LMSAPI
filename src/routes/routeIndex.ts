import express from 'express';
const routes = express();
import authorize from '../_middlewares/auth';



import userRoute from '../routes/userRoute';
import metercapRoute from '../routes/meterCap';
import admin from '../routes/adminRoute';
import commonRoute from '../routes/commonRoute';
import authToken from '../_middlewares/authToken';
import queAnsRoute from '../routes/queAnsRoute';
import reportroute from '../routes/reportRoute';

routes.use('/qa', authToken, queAnsRoute);

routes.use('/report', authToken, reportroute);

routes.use('/user', authToken, userRoute);
//routes.use(authToken);

routes.use('/container', metercapRoute);

routes.use('/admin', admin);
//routes.use('/admin', authToken, admin);


routes.use('', commonRoute);



export default routes;