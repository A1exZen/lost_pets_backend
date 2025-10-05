import prisma from "../db";

export const getUserById = async (id: string) => {
	return await prisma.user.findUnique({
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

export const updateUserRole = async (id: string, role: string) => {
	return await prisma.user.update({
		where: { id },
		data: { role: role as any },
	});
};

export const getUserListings = async (userId: string) => {
	return await prisma.listing.findMany({
		where: { authorId: userId },
		orderBy: { createdAt: 'desc' }
	});
};

export const getUserStats = async () => {
	const [usersCount, listingsCount, commentsCount] = await Promise.all([
		prisma.user.count(),
		prisma.listing.count(),
		prisma.comment.count(),
	]);

	return {
		usersCount,
		listingsCount,
		commentsCount,
		activeListings: await prisma.listing.count({
			where: {
				createdAt: {
					gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
				}
			}
		})
	};
};

export const getAllUsers = async () => {
	return prisma.user.findMany({
		select: {
			id: true,
			email: true,
			role: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: { createdAt: 'desc' }
	});
};

export const deleteUserCascade = async (userId: string) => {
	return await prisma.$transaction(async (tx) => {
		await tx.favorite.deleteMany({ where: { userId } });
		await tx.comment.deleteMany({ where: { authorId: userId } });

		const listings = await tx.listing.findMany({ where: { authorId: userId }, select: { id: true } });
		const listingIds = listings.map(l => l.id);

		if (listingIds.length > 0) {
			await tx.favorite.deleteMany({ where: { announcementId: { in: listingIds } } });
			await tx.comment.deleteMany({ where: { announcementId: { in: listingIds } } });
			await tx.listing.deleteMany({ where: { id: { in: listingIds } } });
		}

		await tx.user.delete({ where: { id: userId } });

		return { success: true };
	});
};