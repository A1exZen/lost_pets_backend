"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (input) => {
    const { email, password } = input;
    const existingUser = await db_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await db_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || "default_secret", { expiresIn: "24h" });
    return { token, user: { id: user.id, email: user.email } };
};
exports.register = register;
const login = async (input) => {
    const { email, password } = input;
    const user = await db_1.default.user.findUnique({ where: { email } });
    if (!user || !user.password) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || "default_secret", { expiresIn: "24h" });
    return { token, user: { id: user.id, email: user.email } };
};
exports.login = login;
