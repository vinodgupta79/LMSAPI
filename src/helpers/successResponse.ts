// helpers/successResponse.ts
interface SuccessResponse {
    status: number;
    message?: string;
    data?: any;
  }
  
  export const sendSuccessResponse = (res: any,message: string,data: any = null,
    statusCode: number = 200): void => {
    const response: SuccessResponse = {
      status: 1,
    };

    if(message!=''){
      response.message=message
    }
    if (data !== null) {
      response.data = data;
    }
  
    res.status(statusCode).json(response);
  };
  