"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavoritesList = exports.toggleFavoriteListing = exports.search = exports.deleteL = exports.update = exports.getById = exports.create = void 0;
const listingService_1 = require("../services/listingService");
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateListingInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - animalType
 *         - location
 *         - dateLost
 *         - contactPhone
 *       properties:
 *         title:
 *           type: string
 *           description: Заголовок объявления
 *         description:
 *           type: string
 *           description: Описание
 *         animalType:
 *           type: string
 *           description: Тип животного
 *         breed:
 *           type: string
 *           description: Порода
 *         location:
 *           type: string
 *           description: Местоположение
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: Фотографии
 *         dateLost:
 *           type: string
 *           format: date-time
 *           description: Дата пропажи
 *         contactPhone:
 *           type: string
 *           description: Контактный телефон
 *     Listing:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         animalType:
 *           type: string
 *         breed:
 *           type: string
 *         location:
 *           type: string
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *         dateLost:
 *           type: string
 *           format: date-time
 *         contactPhone:
 *           type: string
 *         userId:
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
 * /api/listings:
 *   post:
 *     summary: Создать новое объявление
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateListingInput'
 *     responses:
 *       201:
 *         description: Объявление создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 */
const create = async (req, res, next) => {
    try {
        const input = req.body;
        if (req.files && Array.isArray(req.files)) {
            input.photos = req.files.map((file) => `/uploads/${file.filename}`);
        }
        const result = await (0, listingService_1.createListing)(input, req.user.userId);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
/**
 * @swagger
 * /api/listings/{id}:
 *   get:
 *     summary: Получить объявление по ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID объявления
 *     responses:
 *       200:
 *         description: Объявление найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       404:
 *         description: Объявление не найдено
 */
const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, listingService_1.getListingById)(id);
        if (!result) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const input = req.body;
        if (req.files && Array.isArray(req.files)) {
            input.photos = req.files.map((file) => `/uploads/${file.filename}`);
        }
        const result = await (0, listingService_1.updateListing)(id, input, req.user.userId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const deleteL = async (req, res, next) => {
    try {
        const { id } = req.params;
        await (0, listingService_1.deleteListing)(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteL = deleteL;
/**
 * @swagger
 * /api/listings/search:
 *   get:
 *     summary: Поиск объявлений с фильтрами
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: animalType
 *         schema:
 *           type: string
 *         description: Тип животного
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Местоположение
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Дата от
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Дата до
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Лимит результатов
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Смещение
 *     responses:
 *       200:
 *         description: Список объявлений
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 */
const search = async (req, res, next) => {
    try {
        const filters = {
            animalType: req.query.animalType,
            location: req.query.location,
            dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom) : undefined,
            dateTo: req.query.dateTo ? new Date(req.query.dateTo) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
            offset: req.query.offset ? parseInt(req.query.offset) : 0,
        };
        const result = await (0, listingService_1.getFilteredListings)(filters);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.search = search;
const toggleFavoriteListing = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const result = await (0, listingService_1.toggleFavorite)(req.user.userId, listingId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.toggleFavoriteListing = toggleFavoriteListing;
const getUserFavoritesList = async (req, res, next) => {
    try {
        const result = await (0, listingService_1.getUserFavorites)(req.user.userId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserFavoritesList = getUserFavoritesList;
