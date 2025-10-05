import bcrypt from "bcrypt";
import app from "./app";
import prisma from "./db";

const PORT = process.env.PORT || 3000;


async function seedAdminAndUser() {
	const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@pets.local";
	const adminPass = process.env.SEED_ADMIN_PASSWORD || "admin123";
	const userEmail = process.env.SEED_USER_EMAIL || "user@pets.local";
	const userPass = process.env.SEED_USER_PASSWORD || "user12345";

	const createIfMissing = async (email: string, password: string, role: "ADMIN" | "USER") => {
		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) return;
		const hashed = await bcrypt.hash(password, 10);
		await prisma.user.create({ data: { email, password: hashed, role } as any });
		console.log(`Seeded user: ${email} (${role})`);
	};

	await createIfMissing(adminEmail, adminPass, "ADMIN");
	await createIfMissing(userEmail, userPass, "USER");
}

app.listen(PORT, async () => {
	try {
		await seedAdminAndUser();
	} catch (e) {
		console.error("Seed error:", e);
	}
	console.log(`Server running on port ${PORT}`);
});