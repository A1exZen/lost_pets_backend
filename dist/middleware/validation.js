"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateComment = exports.validateCreateListing = exports.validateLogin = exports.validateRegister = void 0;
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
const createListingSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(200, "Title too long"),
    description: zod_1.z.string().min(1, "Description is required").max(1000, "Description too long"),
    animalType: zod_1.z.string().min(1, "Animal type is required"),
    location: zod_1.z.string().min(1, "Location is required"),
    dateLost: zod_1.z.date(),
    contactPhone: zod_1.z.string().min(10, "Phone number is required"),
    breed: zod_1.z.string().optional(),
});
const createCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "Comment content is required").max(500, "Comment too long"),
    announcementId: zod_1.z.string().uuid("Invalid announcement ID"),
});
const validateRegister = (req, res, next) => {
    try {
        registerSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                })),
            });
        }
        next(error);
    }
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    try {
        loginSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                })),
            });
        }
        next(error);
    }
};
exports.validateLogin = validateLogin;
const validateCreateListing = (req, res, next) => {
    try {
        createListingSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                })),
            });
        }
        next(error);
    }
};
exports.validateCreateListing = validateCreateListing;
const validateCreateComment = (req, res, next) => {
    try {
        createCommentSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                })),
            });
        }
        next(error);
    }
};
exports.validateCreateComment = validateCreateComment;
