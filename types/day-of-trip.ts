import type {Expense} from "~/types/expense";
import type {Trip} from "~/types/trip";
import type {TripActivity} from "~/types/trip-activity";

export interface DayOfTrip {
    id: number;
    trip?: Trip;
    date?: Date;
    note?: string;
    expenses?: Expense[];
    activities?: TripActivity[];
}