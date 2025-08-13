import type {UserProfile} from "~/types/user-profile";
import type {Trip} from "~/types/trip";

export interface TripInvite {
    id: number;
    message: string;
    sender: UserProfile;
    recipient: UserProfile;
    trip: Trip;
    participantStatus: string;
    inviteStatus: string;
}