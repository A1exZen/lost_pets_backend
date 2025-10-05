"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.getComments = exports.createComment = void 0;
const db_1 = __importDefault(require("../db"));
const createComment = async (req, res, next) => {
    try {
        const { content, announcementId } = req.body;
        const comment = await db_1.default.comment.create({
            data: {
                content,
                authorId: req.user.userId,
                announcementId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                    }
                }
            }
        });
        res.status(201).json(comment);
    }
    catch (error) {
        next(error);
    }
};
exports.createComment = createComment;
const getComments = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const comments = await db_1.default.comment.findMany({
            where: { announcementId: listingId },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(comments);
    }
    catch (error) {
        next(error);
    }
};
exports.getComments = getComments;
const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await db_1.default.comment.findUnique({
            where: { id },
        });
        if (!comment || comment.authorId !== req.user.userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        await db_1.default.comment.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteComment = deleteComment;
