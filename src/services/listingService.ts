import prisma from "../db";
import { CreateListingInput, UpdateListingInput, FilterOptions } from "../types";

export const createListing = async (input: CreateListingInput, authorId: string) => {
	const listing = await prisma.listing.create({
		data: {
			...input,
			authorId,
		},
	});
	
	return listing;
};

export const getListingById = async (id: string) => {
	return await prisma.listing.findUnique({
		where: { id },
		include: {
			author: {
				select: {
					id: true,
					email: true,
				}
			},
			comments: {
				include: {
					author: {
						select: {
							id: true,
							email: true,
						}
					}
				},
				orderBy: { createdAt: 'desc' }
			}
		}
	});
};

export const updateListing = async (id: string, input: UpdateListingInput, authorId: string) => {
	const listing = await prisma.listing.findUnique({ where: { id } });
	if (!listing || listing.authorId !== authorId) {
		throw new Error("Listing not found or unauthorized");
	}
	
	return await prisma.listing.update({
		where: { id },
		data: input,
	});
};

export const deleteListing = async (id: string) => {
	const listing = await prisma.listing.findUnique({ where: { id } });
	return await prisma.listing.delete({ where: { id } });
};

export const getFilteredListings = async (filters: FilterOptions) => {
	const { animalType, location, dateFrom, dateTo, limit = 10, offset = 0 } = filters;
	
	const whereClause: any = {};
	
	if (animalType) {
		whereClause.animalType = { contains: animalType, mode: 'insensitive' };
	}
	
	if (location) {
		whereClause.location = { contains: location, mode: 'insensitive' };
	}
	
	if (dateFrom || dateTo) {
		whereClause.dateLost = {};
		if (dateFrom) whereClause.dateLost.gte = dateFrom;
		if (dateTo) whereClause.dateLost.lte = dateTo;
	}
	
	const [listings, total] = await Promise.all([
		prisma.listing.findMany({
			where: whereClause,
			include: {
				author: {
					select: {
						id: true,
						email: true,
					}
				}
			},
			skip: offset,
			take: limit,
			orderBy: { createdAt: 'desc' }
		}),
		prisma.listing.count({ where: whereClause })
	]);
	
	return {
		listings,
		total,
		limit,
		offset,
		hasNext: total > offset + limit
	};
};

export const toggleFavorite = async (userId: string, listingId: string) => {
	const existingFavorite = await prisma.favorite.findUnique({
		where: {
			userId_announcementId: {
				userId,
				announcementId: listingId
			}
		}
	});
	
	if (existingFavorite) {
		await prisma.favorite.delete({
			where: {
				userId_announcementId: {
					userId,
					announcementId: listingId
				}
			}
		});
		return { isFavorite: false };
	} else {
		await prisma.favorite.create({
			data: {
				userId,
				announcementId: listingId
			}
		});
		return { isFavorite: true };
	}
};

export const getUserFavorites = async (userId: string) => {
	return await prisma.favorite.findMany({
		where: { userId },
		include: {
			announcement: {
				include: {
					author: {
						select: {
							id: true,
							email: true,
						}
					}
				}
			}
		}
	});
};