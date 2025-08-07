import type { TripParticipant } from "~/types/trip-participant";
import type { DayOfTrip } from "~/types/day-of-trip";
import type { Trip } from "~/types/trip";

export interface Expense {
    id: number;
    name: string;
    sum: number;
    category: "drinks"; //a ajouter au backend!
    dayOfTrip: DayOfTrip;
    trip: Trip;
    paymentMethod: string;
    divideBetween: TripParticipant[];
    paidBy: TripParticipant;
    personal : boolean;
}
