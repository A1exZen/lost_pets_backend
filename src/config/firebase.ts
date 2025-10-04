import admin from "firebase-admin";

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: process.env.FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
			}),
		});
		console.info("Firebase Admin SDK initialized successfully");
	} catch (error) {
		console.error(`Failed to initialize Firebase Admin SDK: ${(error as Error).message}`);
		throw error;
	}
}

export const auth = admin.auth();
export const firestore = admin.firestore();
export default admin;