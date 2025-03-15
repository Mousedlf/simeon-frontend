import type {Trip} from "./trip";
import type {UserProfile} from "./profile";

export interface TripParticipant {
    id: number;
    trip: Trip
    role: string;
    participant: UserProfile
    imageSrc: string;
}