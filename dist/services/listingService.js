"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavorites = exports.toggleFavorite = exports.getFilteredListings = exports.deleteListing = exports.updateListing = exports.getListingById = exports.createListing = void 0;
const db_1 = __importDefault(require("../db"));
const createListing = async (input, authorId) => {
    const listing = await db_1.default.listing.create({
        data: {
            ...input,
            authorId,
        },
    });
    return listing;
};
exports.createListing = createListing;
const getListingById = async (id) => {
    return await db_1.default.listing.findUnique({
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
exports.getListingById = getListingById;
const updateListing = async (id, input, authorId) => {
    const listing = await db_1.default.listing.findUnique({ where: { id } });
    if (!listing || listing.authorId !== authorId) {
        throw new Error("Listing not found or unauthorized");
    }
    return await db_1.default.listing.update({
        where: { id },
        data: input,
    });
};
exports.updateListing = updateListing;
const deleteListing = async (id) => {
    const listing = await db_1.default.listing.findUnique({ where: { id } });
    return await db_1.default.listing.delete({ where: { id } });
};
exports.deleteListing = deleteListing;
const getFilteredListings = async (filters) => {
    const { animalType, location, dateFrom, dateTo, limit = 10, offset = 0 } = filters;
    const whereClause = {};
    if (animalType) {
        whereClause.animalType = { contains: animalType, mode: 'insensitive' };
    }
    if (location) {
        whereClause.location = { contains: location, mode: 'insensitive' };
    }
    if (dateFrom || dateTo) {
        whereClause.dateLost = {};
        if (dateFrom)
            whereClause.dateLost.gte = dateFrom;
        if (dateTo)
            whereClause.dateLost.lte = dateTo;
    }
    const [listings, total] = await Promise.all([
        db_1.default.listing.findMany({
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
        db_1.default.listing.count({ where: whereClause })
    ]);
    return {
        listings,
        total,
        limit,
        offset,
        hasNext: total > offset + limit
    };
};
exports.getFilteredListings = getFilteredListings;
const toggleFavorite = async (userId, listingId) => {
    const existingFavorite = await db_1.default.favorite.findUnique({
        where: {
            userId_announcementId: {
                userId,
                announcementId: listingId
            }
        }
    });
    if (existingFavorite) {
        await db_1.default.favorite.delete({
            where: {
                userId_announcementId: {
                    userId,
                    announcementId: listingId
                }
            }
        });
        return { isFavorite: false };
    }
    else {
        await db_1.default.favorite.create({
            data: {
                userId,
                announcementId: listingId
            }
        });
        return { isFavorite: true };
    }
};
exports.toggleFavorite = toggleFavorite;
const getUserFavorites = async (userId) => {
    return await db_1.default.favorite.findMany({
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
exports.getUserFavorites = getUserFavorites;
