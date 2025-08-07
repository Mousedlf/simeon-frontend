import type { TripParticipant } from "~/types/trip-participant";
import type {DayOfTrip} from "~/types/day-of-trip";

export interface Trip {
    id: number;
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    public?: boolean;
    participants?: TripParticipant[];
    budget?: number;
    imageSrc?: string;
    daysOfTrip?: DayOfTrip[];
}
