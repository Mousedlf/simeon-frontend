import type {Expense} from "~/types/expense";
import type {Trip} from "~/types/trip";

export interface DayOfTrip {
    id: number;
    trip?: Trip;
    date?: Date;
    note?: string;
    expenses?: Expense[];
}