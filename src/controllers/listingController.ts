import { NextFunction, Request, Response } from "express";
import {
	createListing,
	deleteListing,
	getFilteredListings,
	getListingById,
	getUserFavorites,
	toggleFavorite,
	updateListing
} from "../services/listingService";
import { CreateListingInput, FilterOptions, UpdateListingInput } from "../types";

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
export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const input: CreateListingInput = req.body;

		if (req.files && Array.isArray(req.files)) {
			input.photos = req.files.map((file: any) => `/uploads/${file.filename}`);
		}

		const result = await createListing(input, req.user!.userId);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

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
export const getById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const result = await getListingById(id);
		if (!result) {
			return res.status(404).json({ error: "Listing not found" });
		}
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const input: UpdateListingInput = req.body;

		if (req.files && Array.isArray(req.files)) {
			input.photos = req.files.map((file: any) => `/uploads/${file.filename}`);
		}

		const result = await updateListing(id, input, req.user!.userId);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteL = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		await deleteListing(id);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

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
export const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const filters: FilterOptions = {
			animalType: req.query.animalType as string,
			location: req.query.location as string,
			dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
			dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
			limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
			offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
		};

		const result = await getFilteredListings(filters);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const toggleFavoriteListing = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { listingId } = req.params;
		const result = await toggleFavorite(req.user!.userId, listingId);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const getUserFavoritesList = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await getUserFavorites(req.user!.userId);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};