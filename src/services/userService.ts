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