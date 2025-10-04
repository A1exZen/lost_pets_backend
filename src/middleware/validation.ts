import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const registerSchema = z.object({
	email: z.email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
	email: z.email("Invalid email format"),
	password: z.string().min(1, "Password is required"),
});

const createListingSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title too long"),
	description: z.string().min(1, "Description is required").max(1000, "Description too long"),
	animalType: z.string().min(1, "Animal type is required"),
	location: z.string().min(1, "Location is required"),
	dateLost: z.date(),
	contactPhone: z.string().min(10, "Phone number is required"),
	breed: z.string().optional(),
});

const createCommentSchema = z.object({
	content: z.string().min(1, "Comment content is required").max(500, "Comment too long"),
	announcementId: z.string().uuid("Invalid announcement ID"),
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
	try {
		registerSchema.parse(req.body);
		next();
	} catch (error) {
		if (error instanceof z.ZodError) {
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

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
	try {
		loginSchema.parse(req.body);
		next();
	} catch (error) {
		if (error instanceof z.ZodError) {
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

export const validateCreateListing = (req: Request, res: Response, next: NextFunction) => {
	try {
		createListingSchema.parse(req.body);
		next();
	} catch (error) {
		if (error instanceof z.ZodError) {
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

export const validateCreateComment = (req: Request, res: Response, next: NextFunction) => {
	try {
		createCommentSchema.parse(req.body);
		next();
	} catch (error) {
		if (error instanceof z.ZodError) {
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