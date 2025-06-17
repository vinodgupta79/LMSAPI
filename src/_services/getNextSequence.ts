import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
export const getNextSequence = async (org_id: any): Promise<number> => {
    try {
        const result= await sequelize.query(`Select max(SEQUENCE) as sequence from CONTENTSTATIC where ORGSTRUCTUREID=${org_id}`, {
            type: QueryTypes.SELECT
        })
        const seq:number= result[0].sequence 
        return seq;
    } catch (error) {
        let er: any = error;
        throw er;
    }
}