'use client';
import { useCallback, useState } from "react";
import { SafeReservation, SafeUser } from "../types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Container from "../components/Container";
import axios from "axios";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { IoBagRemove } from "react-icons/io5";

interface TripsClientProps{
    reservations: SafeReservation[];
    currentUser?: SafeUser | null
}

const TripsClient: React.FC<TripsClientProps> = ({
    reservations,
    currentUser
}) => {
    const router= useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/reservations/${id}`)
        .then(() => {
            toast.success('Reservation cancelled');
            router.refresh();
        })
        .catch((error) => {
        toast.error(error?.response?.data?.error);
        })
        .finally(() => {
            setDeletingId('');
        })
    }, [router]);
    return(
        <Container>
            <Heading 
            title="Trips"
            subtitle="Where you have been and where you're going"
            />
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {reservations.map((reservation) => (
                        <ListingCard 
                            key={reservation.id}
                            data={reservation.listing}
                            reservation={reservation}
                            actionId={reservation.id}
                            onAction={onCancel}
                            disabled={deletingId === reservation.id}
                            actionLabel={<span className="flex gap-2 justify-center text-lg items-center"><IoBagRemove className="text-xl" /> Cancel</span>}
                            currentUser={currentUser}
                        />
                    ))}
            </div>

        </Container> 
    )
};

export default TripsClient;