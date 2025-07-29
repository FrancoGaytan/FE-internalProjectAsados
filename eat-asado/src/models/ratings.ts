export interface IRatingRequest {
	score: number;
}

export interface EventRatingData {
	avgScore: number;
	ratingsAmount: number;
}

export interface IRatingResponse {
	id: string;
	user: string;
	score: number;
}
