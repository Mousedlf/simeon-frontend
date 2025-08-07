import type {TripParticipant} from "~/types/trip-participant";
import type {Message} from "~/types/message";

export interface Conversation {
    id: number;
    name?: string;
    participants?: TripParticipant[];
    messages?: Message[] ;
}