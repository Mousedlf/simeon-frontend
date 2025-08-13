import type { TripParticipant } from "~/types/trip-participant";
import type { DayOfTrip } from "~/types/day-of-trip";
import type { Trip } from "~/types/trip";
import type {Category} from "~/types/Category";

export interface Expense {
    id: number;
    name: string;
    amountLocalCurrency: number;
    amountEuro: number;
    category: Category;
    dayOfTrip: DayOfTrip;
    trip: Trip;
    paymentMethod: string;
    divideBetween: TripParticipant[];
    paidBy: TripParticipant;
    personal : boolean;
}
