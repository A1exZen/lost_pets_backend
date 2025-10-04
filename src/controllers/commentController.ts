import { Request, Response, NextFunction } from "express";
import prisma from "../db";
import { CreateCommentInput } from "../types";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { content, announcementId }: CreateCommentInput = req.body;
		
		const comment = await prisma.comment.create({
			data: {
				content,
				authorId: req.user!.userId,
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
	} catch (error) {
		next(error);
	}
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { listingId } = req.params;
		
		const comments = await prisma.comment.findMany({
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
	} catch (error) {
		next(error);
	}
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		
		const comment = await prisma.comment.findUnique({
			where: { id },
		});
		
		if (!comment || comment.authorId !== req.user!.userId) {
			return res.status(403).json({ error: "Unauthorized" });
		}
		
		await prisma.comment.delete({
			where: { id },
		});
		
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};