export interface JwtPayload {
	userId: string;
	role?: string;
}

export interface AuthRequest extends Express.Request {
	user?: JwtPayload;
}

export interface RegisterInput {
	email: string;
	password: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface CreateListingInput {
	title: string;
	description: string;
	animalType: string;
	breed?: string;
	location: string;
	photos?: string[];
	dateLost: Date;
	contactPhone: string;
}

export interface UpdateListingInput extends Partial<CreateListingInput> {}

export interface FilterOptions {
	animalType?: string;
	location?: string;
	dateFrom?: Date;
	dateTo?: Date;
	limit?: number;
	offset?: number;
}

export interface CreateCommentInput {
	content: string;
	announcementId: string;
}