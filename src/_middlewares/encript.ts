import { exec, execFile, fork, spawn } from 'child_process';
import path from 'path';
import constants from '../_dbs/oracle/constants';



const encriptData = async function (data: any) {
    return new Promise((resolve, reject) => {
        try 
        {
            var filePath = path.join(__dirname,'../../references/NetBeansProjects/RNISWS2_E/dist/RNISWS2_E.jar');
            var dataAsString;
            let incommingDataType :string = typeof data;
            if(incommingDataType == 'object')
            {
                dataAsString = JSON.stringify(data);
                dataAsString = dataAsString.replace(/"/g, '\\"');
            }
            console.log('----------------data after stringify');
            console.log(dataAsString);
            console.log('------------------------');
            console.log(`java -jar "${filePath}" "${dataAsString}"`);

            exec(`java -jar "${filePath}" "${dataAsString}"`, function(err:any, stdout:any, stderr:any) {
                if (err) {
                    console.log('Error ------------ ')
                    console.log(err)
                }
                else if(stdout != undefined)
                { 
                    let encryptedData:any = stdout;
                   //  encryptedData = encryptedData.replace(/\s+/g,'')
                    resolve(encryptedData);
                }
                else if(stderr)
                {
                    console.log('StdErr ------------ ')
                    console.log(stderr)
                    reject(stderr);
                }
            })
        }
        catch(err)
        {
           reject(err);
        }   
    });
}

const decriptData = async function (ecriptedData: any) {
    return new Promise((resolve, reject) => {
        try 
        {
            var filePath = path.join(__dirname,'../../references/NetBeansProjects/RNISWS2/dist/RNISWS2_D.jar');
            exec(`java -jar "${filePath}" ${ecriptedData}`, function(err:any, stdout:any, stderr:any) {
                if (err) {
                    console.log('Error ------------ ')
                    console.log(err)
                }
                else if(stdout != undefined)
                { 
                    let decryptedData:any = stdout;
                   // decryptedData = decryptedData.replace(/\s+/g,'')
                    resolve(decryptedData);
                }
                else if(stderr)
                {
                    console.log('StdErr ------------ ')
                    console.log(stderr)
                    reject(stderr);
                }
            })
        }
        catch(err)
        {
           reject(err);
        }  
    });
}


export default {
    encriptData,
    decriptData
}