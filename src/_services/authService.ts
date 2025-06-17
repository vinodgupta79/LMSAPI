import { sequelize, QueryTypes } from '../_dbs/oracle/oracleConnection';
import constants from '../_dbs/oracle/constants';
import User from '../_models/user';

const getUsers = async (): Promise<User[]> => {
    let user: User[] = [];
    let newUser = new User();
    newUser.id = 1;
    newUser.firstName = 'Vikash';
    newUser.email = 'vikash@gmail.com'

    user.push(newUser);

    newUser = new User();
    newUser.id = 2;
    newUser.firstName = 'Ritvik';
    newUser.email = 'ritvik@gmail.com'

    user.push(newUser);

    newUser = new User();
    newUser.id = 3;
    newUser.firstName = 'Ritik';
    newUser.email = 'ritik@gmail.com'

    user.push(newUser);

    return user;
};



const createUser = async (user: User): Promise<User> => {
    let newUser = new User();
    newUser = user;
    try {
        const result: any = await sequelize.query(`select * from  ${constants.p_user_master}(action => 'create', userid => '${newUser.userId}', passwd => '${newUser.password}', firstname => '${newUser.firstName}', lastname => '${newUser.lastName}', mobileno => '${newUser.mobile}', emailid => '${newUser.email}', usertype => '${newUser.userTypeId}', createdby => '${newUser.createdBy}' )`, {
            replacements: {},
            type: QueryTypes.SELECT
        });

        newUser = <User>result[0];
        return newUser;
    }
    catch (err) {
        let er: any = err;
        throw er;
    }

};

// export const create = async (payload: IngredientInput): Promise<IngredientOuput> => {
//     const ingredient = await User.create(payload)
//     return ingredient
// }

// export const update = async (id: number, payload: Partial<IngredientInput>): Promise<IngredientOuput> => {
//     const ingredient = await Ingredient.findByPk(id)
//     if (!ingredient) {
//         // @todo throw custom error
//         throw new Error('not found')
//     }
//     const updatedIngredient = await (ingredient as Ingredient).update(payload)
//     return updatedIngredient
// }

// export const getById = async (id: number): Promise<IngredientOuput> => {
//     const ingredient = await Ingredient.findByPk(id)
//     if (!ingredient) {
//         // @todo throw custom error
//         throw new Error('not found')
//     }
//     return ingredient
// }

// export const deleteById = async (id: number): Promise<boolean> => {
//     const deletedIngredientCount = await Ingredient.destroy({
//         where: { id }
//     })
//     return !!deletedIngredientCount
// }

// export const getAll = async (filters?: GetAllIngredientsFilters): Promise<IngredientOuput[]> => {
//     return Ingredient.findAll({
//         where: {
//             ...(filters ?.isDeleted && { deletedAt: { [Op.not]: null } })
//         },
//         ...((filters ?.isDeleted || filters ?.includeDeleted) && { paranoid: true })
//     })
// }

export default {
    createUser,
    getUsers,

}