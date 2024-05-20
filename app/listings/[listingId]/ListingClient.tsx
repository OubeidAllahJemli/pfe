'use client';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { categories } from "@/app/components/navbar/Categories";
import { SafeListing, SafeReservation, SafeReview, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Range } from "react-date-range";
import { toast } from "react-hot-toast";
import axios from "axios";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import ListingReservation from "@/app/components/listings/ListingReservation";
import ListingReview from "@/app/components/listings/ListingReview";

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

interface ListingClientProps {
    reservations?: SafeReservation[];
    listing: SafeListing & {
        user: SafeUser;
    };
    currentUser?: SafeUser | null;
}

interface ReviewFormInputs {
    rating: string;
    comment: string;
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [],
    currentUser,
}) => {
    const loginModal = useLoginModal();
    const router = useRouter();
    const [reviews, setReviews] = useState<SafeReview[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ReviewFormInputs>();

    const disableDates = useMemo(() => {
        let dates: Date[] = [];
        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate),
            });
            dates = [...dates, ...range];
        });
        return dates;
    }, [reservations]);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await axios.get(`/api/reviews/${listing.id}`);
            setReviews(response.data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    }, [listing.id]);
    
    
    

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }
        setIsLoading(true);
        axios
            .post("/api/reservations", {
                totalPrice,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                listingId: listing?.id,
            })
            .then(() => {
                toast.success("Listing reserved!");
                setDateRange(initialDateRange);
                router.push("/trips");
            })
            .catch(() => {
                toast.error("Something went wrong.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [
        totalPrice,
        dateRange,
        listing?.id,
        router,
        currentUser,
        loginModal,
    ]);

    const onSubmitReview: SubmitHandler<ReviewFormInputs> = async (data) => {
        if (!currentUser) {
            return loginModal.onOpen();
        }
        setIsLoading(true);
        try {
            await axios.post(`/api/reviews`, {
                ...data,
                rating: parseInt(data.rating), // Convert rating to number
                listingId: listing.id,
                userId: currentUser.id,
            });
            toast.success("Review submitted!");
            reset();
            fetchReviews(); // Refresh reviews after submission
        } catch (error) {
            toast.error("Failed to submit review.");
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            );
            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price);
            } else {
                setTotalPrice(listing.price);
            }
        }
    }, [dateRange, listing.price]);

    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category);
    }, [listing.category]);

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guessCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                        />
                        <div className="order-first mb-10 md:order-last md:col-span-3">
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disableDates}
                            />
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <ListingReview
                        reviews={reviews}
                        onSubmitReview={onSubmitReview}
                        isLoading={isLoading}
                        currentUser={currentUser ?? null}
                    />
                    {/* End of Reviews Section */}
                </div>
            </div>
        </Container>
    );
};

export default ListingClient;

                       
