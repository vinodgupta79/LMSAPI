const success = (results: any, token?: any) => {
    if (token != undefined && token.length > 0)

        return {
            res: results,
            token: token
        };

    else
        return results
    // return {
    //     res:results
    // };
};

const payload = (results: any, token?: any) => {
    if (token != undefined && token.length > 0)

        return {
            payload: results,
            token: token
        };

    else

        return {
            payload: results
        };
};

const asstring = (results: string) => {
    return results;
};


// const success = (results: any) => {
//     let success: string = 'true';
//     return {
//         success,
//         res: results
//     };
// };


const error = (error: string) => {
    // // List of common HTTP request code
    // const codes = [200, 201, 400, 401, 404, 403, 422, 500];
    // // Get matched code
    // const findCode = codes.find((code) => code == statusCode);

    // if (!findCode) statusCode = 500;
    // else statusCode = findCode;

    let err: string = 'true';
    return {
        error: err,
        message: error
    };
};


const validation = (errors: any) => {
    return {
        message: "Validation errors",
        error: true,
        code: 422,
        errors
    };
};

export default {
    success,
    error,
    validation,
    payload,
    asstring
}