import prisma from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "../types";

export const register = async (input: RegisterInput) => {
	const { email, password } = input;
	
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new Error("User already exists");
	}
	
	const hashedPassword = await bcrypt.hash(password, 10);
	
	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
		},
	});
	
	const token = jwt.sign(
		{ userId: user.id },
		process.env.JWT_SECRET || "default_secret",
		{ expiresIn: "24h" }
	);
	
	return { token, user: { id: user.id, email: user.email } };
};

export const login = async (input: LoginInput) => {
	const { email, password } = input;
	
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user || !user.password) {
		throw new Error("Invalid credentials");
	}
	
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Invalid credentials");
	}
	
	const token = jwt.sign(
		{ userId: user.id },
		process.env.JWT_SECRET || "default_secret",
		{ expiresIn: "24h" }
	);
	
	return { token, user: { id: user.id, email: user.email } };
};