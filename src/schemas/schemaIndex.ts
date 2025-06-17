import Joi, { ObjectSchema } from "joi";


import { addCourse } from "./courseSchema"

export default {
    "/course/new": addCourse
} as { [key: string]: ObjectSchema }