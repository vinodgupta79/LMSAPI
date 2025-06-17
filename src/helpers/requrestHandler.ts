import { RequestHandler } from 'express';
import { AppError } from './customError';
import { sendSuccessResponse } from './successResponse';
// import response from './utils/response';

export const createHandler=(serviceMethod:(body:Object)=>Promise<any>,entityName:string):RequestHandler=>{
    return async(req,res,next)=>{
        try {
            const body=req.body;
            const result = await serviceMethod(body);
            sendSuccessResponse(res, `${entityName} created successfully`);
        } catch (error:any) {
            return next(new AppError(error.message, 400));
        }
    }
}
export const deletehandler = (serviceMethod: (id: string) => Promise<any>, entityName: string): RequestHandler => {
    return async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return next(new AppError(`${entityName}Id is required`, 400));
            }

            const result = await serviceMethod(id);
            sendSuccessResponse(res, `${entityName} deleted successfully`);
        } catch (error:any) {
            return next(new AppError(error.message, 400));
        }
    };
};

export const updateHandler=(serviceMethod:(id:string,body:any)=>Promise<any>,entityName:string):RequestHandler=>{
    return async(req,res,next)=>{
        try {
            const { id } = req.params;
            if (!id) {
                return next(new AppError(`${entityName}Id is required`, 400));
            }
            const body=req.body;
            const result = await serviceMethod(id,body);
            sendSuccessResponse(res, `${entityName} updated successfully`);
            
        } catch (error:any) {
            return next(new AppError(error.message, 400));
        }
    }
}