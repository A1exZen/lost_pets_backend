"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.getUserListings = exports.updateUserRole = exports.getUserById = void 0;
const db_1 = __importDefault(require("../db"));
const getUserById = async (id) => {
    return await db_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    });
};
exports.getUserById = getUserById;
const updateUserRole = async (id, role) => {
    return await db_1.default.user.update({
        where: { id },
        data: { role: role },
    });
};
exports.updateUserRole = updateUserRole;
const getUserListings = async (userId) => {
    return await db_1.default.listing.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' }
    });
};
exports.getUserListings = getUserListings;
const getUserStats = async () => {
    const [usersCount, listingsCount, commentsCount] = await Promise.all([
        db_1.default.user.count(),
        db_1.default.listing.count(),
        db_1.default.comment.count(),
    ]);
    return {
        usersCount,
        listingsCount,
        commentsCount,
        activeListings: await db_1.default.listing.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
            }
        })
    };
};
exports.getUserStats = getUserStats;
