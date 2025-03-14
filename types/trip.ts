import type { TripParticipant } from "~/types/trip-participant";

export interface Trip {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    public: boolean;
    participants: TripParticipant[];
    budget: number;
    imageSrc : string;
}
