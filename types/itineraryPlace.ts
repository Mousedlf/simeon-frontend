export interface ItineraryPlace {
    id: string;
    name?: string;
    address?: string;
    order?: number;
    open?: boolean;
    openingHours?: [];
    note?: string;
}