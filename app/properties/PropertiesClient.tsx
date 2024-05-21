'use client';

import { useCallback, useState } from "react";
import { SafeListing, SafeUser } from "../types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Container from "../components/Container";
import axios from "axios";
import Heading from "../components/Heading";
import PropertyCard from "../components/listings/PropertyCard";
import UpdateModal from "../components/modals/UpdateModal";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";

interface PropertiesClientProps {
    listings: SafeListing[];
    currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
    listings,
    currentUser
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');
    const [editingListing, setEditingListing] = useState<SafeListing | null>(null);

    const onCancel = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/listings/${id}`)
            .then(() => {
                toast.success('Listing deleted');
                router.refresh();
            })
            .catch((error) => {
                toast.error(error?.response?.data?.error);
            })
            .finally(() => {
                setDeletingId('');
            });
    }, [router]);

    const handleEditListing = useCallback((listing: SafeListing) => {
        setEditingListing(listing);
    }, []);

    const handleSubmitListing = useCallback(async (id: string, updatedListing: Partial<SafeListing>) => {
        try {
            const requestData = {
                title: updatedListing.title,
                description: updatedListing.description,
                price: parseFloat(String(updatedListing.price || "0")), 
            };
            console.log('requestData:', requestData);
    
            await axios.patch(`/api/listings/${id}`, requestData);
    
     
            toast.success('Listing updated');
            setEditingListing(null);
            router.refresh();
        } catch (error: any) {
            toast.error(error?.response?.data?.error || 'Failed to update listing');
        }
    }, [router, setEditingListing]);

    return (
        <Container>
            <Heading 
                title="Properties"
                subtitle="List of your properties"
            />
            {editingListing && (
                <UpdateModal 
                    isOpen={!!editingListing} 
                    onClose={() => setEditingListing(null)} 
                    onSubmit={(id, updatedListing) => handleSubmitListing(id, updatedListing)} 
                    listing={editingListing} 
                />
            )}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {listings.map((listing) => (
                    <PropertyCard 
                        key={listing.id}
                        data={listing}
                        actionId={listing.id}
                        onAction={onCancel}
                        onEdit={handleEditListing}
                        disabled={deletingId === listing.id}
                        actionLabel={<span className="flex gap-2 text-lg items-center"><FaRegTrashAlt className="text-xl" /> Delete</span>
                    }
                        editLabel={<span className="flex gap-2 text-lg items-center"><CiEdit className="text-2xl" /> Edit</span> }
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    );
};

export default PropertiesClient;