import crypto from 'crypto';

const algorithm = "aes-256-cbc"; 

// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);

// secret key generate 32 bytes of random data
const Securitykey = crypto.randomBytes(32); 




const encriptData = async function (data: any) { 
    return new Promise((resolve, reject) => {
            // the cipher function
            const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

            // encrypt the message
            // input encoding
            // output encoding
            let encryptedData = cipher.update(data, "utf-8", "hex");


            encryptedData += cipher.final("hex");
            resolve(encryptedData);
    });
}

const decriptData = async function (ecriptedData: any) {
    return new Promise((resolve, reject) => {
            // the decipher function
            const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

            let decryptedData = decipher.update(ecriptedData, "hex", "utf-8");

            decryptedData += decipher.final("utf8");

            resolve(decryptedData);
    });
}


export default {
    encriptData,
    decriptData
}