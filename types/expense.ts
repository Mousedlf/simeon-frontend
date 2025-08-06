import type { TripParticipant } from "~/types/trip-participant";

export interface Expense {
    id: number;
    name: string;
    category: string;
    date: string;
    public: boolean;
    participants: TripParticipant[];
    budget: number;
    imageSrc : string;
}
