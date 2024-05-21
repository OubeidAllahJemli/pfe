'use client';
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from 'date-fns';
import useCountries from "@/app/hooks/useCountries";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";

interface PropertyCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    onEdit?: (listing: SafeListing) => void;
    disabled?: boolean;
    actionLabel?: any;
    editLabel?: any;
    actionId?: string;
    currentUser?: SafeUser | null;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    data,
    reservation,
    onAction,
    onEdit,
    disabled,
    actionLabel,
    editLabel,
    actionId = "",
    currentUser
}) => {
    const router = useRouter();
    const { getByValue } = useCountries();

    const location = getByValue(data.locationValue);

    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (disabled) {
                return;
            }

            onAction?.(actionId);
        }, [onAction, actionId, disabled]);

    const handleEdit = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onEdit?.(data);
        }, [onEdit, data]);

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }
        return data.price;
    }, [reservation, data.price]);

    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null;
        }
        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation]);

    return (
        <div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="col-span-1 cursor-pointer group"
        >
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                    <Image
                        fill
                        alt="Listing"
                        src={data.imageSrc}
                        className="object-cover h-full w-full group-hover:scale-110 transition"
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-bold text-lg">
                    <h1>{data.title}</h1>
                </div>
                <div className="font-semibold text-md">
                    {location?.label}
                </div>
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        TND{price}
                    </div>
                    {!reservation && (
                        <div className="font-light">/night</div>
                    )}
                </div>
                {currentUser?.id===data.userId&&<div>Published: <span className="font-bold">{data?.published?"Yes":"Waiting for approval"}</span></div>}
                <div className="grid grid-cols-2 gap-2">

                    {onEdit && editLabel && (
                        <button
                        disabled={disabled}

                            onClick={handleEdit}
                            type="button"
                            className=" hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2">
                            {editLabel}
                        </button>

                    )}
                                        {onAction && actionLabel && (
                
                <button
                disabled={disabled}
                onClick={handleCancel}
                type="button"
                className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2">
                {actionLabel}
            </button>
            )}
                </div>
            </div>
        </div>
    );
}

export default PropertyCard;