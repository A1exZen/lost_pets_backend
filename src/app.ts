import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import listingRoutes from "./routes/listingRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Pet Lost Finder API",
			version: "1.0.0",
			description: "API для платформы поиска пропавших животных",
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT || 3000}`,
				description: "Development server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
	explorer: true,
	customCss: '.swagger-ui .topbar { display: none }',
	customSiteTitle: "Pet Lost Finder API"
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error(err.stack);
	res.status(500).json({
		error: err.message || "Internal server error",
		...(process.env.NODE_ENV === "development" && { stack: err.stack })
	});
});

export default app;