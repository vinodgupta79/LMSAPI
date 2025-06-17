import multer from "multer";
import path from "path";
import fs from "fs";
import { getNextSequence } from "../_services/getNextSequence";
import { AppError } from "../helpers/customError";

// Helper function to create directories
const createDirectory = (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Helper function to get the main path based on the environment
const getMainPath = (): any => {
    const environment = process.env.NODE_ENV || "development";
    return environment === "development"
        ? process.env.content_path 
        : process.env.content_path;
};

// Helper function to validate required parameters
const validateParameters = (params: Record<string, any>, required: string[]): void => {
    const missing = required.filter(param => !params[param]);
    if (missing.length) {
        throw new AppError(`Missing required parameters: ${missing.join(", ")}`, 400);
    }
};

// Helper function to generate a timestamped filename
const generateTimestampedFilename = (originalName: string): string => {
    const ext = path.extname(originalName);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `${timestamp}${ext}`;
};

// Helper function to determine file destination based on mimetype and route
const getFileDestination = (file: Express.Multer.File, req: any): any => {
    const mainPath = getMainPath();
    switch (req.url) {
        case "/upload":
            validateParameters(req.body, ["org_id"]);
            if (file.mimetype === "application/pdf") {
                return `${mainPath}/uploadeddocument`;
            }
            else if (file.mimetype === "video/mp4") {
                return `${mainPath}/pdf/${req.body.org_id}`;
            }
            else {
                throw new AppError("Unsupported file type!", 400);
            }
        case "/upload/user-data":
            if (file.mimetype === "application/vnd.ms-excel" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                validateParameters(req.body, ["course_id", "sponsor_id", "batch_name"]);
                return `${mainPath}/excel/user/${req.body.batch_name}`;
            } else {
                throw new AppError("Unsupported file type!", 400);
            }
        case "/upload/exam-data":
            if (file.mimetype === "application/vnd.ms-excel" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                validateParameters(req.body, ["exam_id"]);
                return `${mainPath}/excel/questions/${req.body.exam_id}`;
            } else {
                throw new AppError("Unsupported file type!", 400);

            }

    }
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const dest = getFileDestination(file, req);
            createDirectory(dest);
            cb(null, dest);
        } catch (error: any) {
            cb(error, "");
        }
    },
    filename: async (req, file, cb) => {
        try {
            if (file.mimetype === "application/pdf" || file.mimetype === "video/mp4") {
                const sequence = await getNextSequence(req.body.org_id);
                const ext = path.extname(file.originalname);
                cb(null, `${sequence ? sequence + 1 : 1}${ext}`);
            } else {
                cb(null, generateTimestampedFilename(file.originalname));
            }
        } catch (error: any) {
            cb(error, "");
        }
    },
});

// Multer upload configuration
const upload = multer({ storage });

export { upload };
