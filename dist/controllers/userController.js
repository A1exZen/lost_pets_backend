"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.getUserData = exports.updateUser = exports.getProfile = void 0;
const userService_1 = require("../services/userService");
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Получить профиль пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 */
const getProfile = async (req, res, next) => {
    try {
        const result = await (0, userService_1.getUserById)(req.user.userId);
        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Обновить профиль пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Профиль обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 */
const updateUser = async (req, res, next) => {
    try {
        const { role } = req.body;
        const result = await (0, userService_1.updateUserRole)(req.user.userId, role);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
/**
 * @swagger
 * /api/users/my-listings:
 *   get:
 *     summary: Получить объявления пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список объявлений пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Не авторизован
 */
const getUserData = async (req, res, next) => {
    try {
        const result = await (0, userService_1.getUserListings)(req.user.userId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserData = getUserData;
/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Получить статистику пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                 totalListings:
 *                   type: number
 *       401:
 *         description: Не авторизован
 */
const getStats = async (req, res, next) => {
    try {
        const result = await (0, userService_1.getUserStats)();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getStats = getStats;
