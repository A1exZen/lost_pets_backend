import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];
	
	if (!token) {
		return res.status(401).json({ error: "Access denied. No token provided." });
	}
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as JwtPayload;
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).json({ error: "Invalid token." });
	}
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		return res.status(401).json({ error: "Access denied. No token provided." });
	}
	
	if (req.user.role !== 'ADMIN') {
		return res.status(403).json({ error: "Access denied. Admin role required." });
	}
	
	next();
};