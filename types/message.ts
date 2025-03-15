import type {TripParticipant} from "~/types/trip-participant";

export interface Message {
    id: string;
    content: string;
    author: TripParticipant;
    createdAt: Date;
    updatedAt: Date;
    pinned: boolean;
}