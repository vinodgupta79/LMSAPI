import Joi from "joi";
import { CustomError } from "../helpers/validatorCustomError";

export const addCourse = Joi.object({
    orgStructureName: Joi.string().required().error((errors) => CustomError("orgStructureName", errors)),

    parentKey: Joi.number().required().error((errors) => CustomError("parentKey", errors)),

    position: Joi.number().required().error((errors) => CustomError("position", errors)),

    typeOfOrg: Joi.string().required().error((errors) => CustomError("typeOfOrg", errors)),

    hierarchyCode: Joi.string().required().error((errors) => CustomError("hierarchyCode", errors)),

    timePeriodMin: Joi.number().required().error((errors) => CustomError("timePeriodMin", errors)),

    timePeriodMax: Joi.number().required().error((errors) => CustomError("timePeriodMax", errors)),

    mandatoryToNext: Joi.boolean().required().error((errors) => CustomError("mandatoryToNext", errors)),

    groupType: Joi.string().required().error((errors) => CustomError("groupType", errors)),

    orgStructureHName: Joi.string().required().error((errors) => CustomError("orgStructureHName", errors)),



})