import { Listing, Reservation, User, Review } from "@prisma/client";

export type SafeListing = Omit< 
Listing,
"createdAt"
> & {
    createdAt: string;
}

export type SafeReservation = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate" | "listing"
> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: SafeListing;
}

export type SafeUser = Omit<
User,
"createdAt" | "updatedAt" | "emailVerified" 
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
};
export type SafeReview = Omit<
Review,
"createdAt" | "user"
> & {
    createdAt: string;
    user: SafeUser;
};