'use client';
import { useState, useEffect } from "react";
import { SafeListing } from "@/app/types";
import Modal from "./Modal";
import Input from "../inputs/Input";
import { 
    FieldValues,
    useForm
} from 'react-hook-form';

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, updatedListing: Partial<SafeListing>) => void;
    listing: SafeListing;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, onSubmit, listing }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            title: listing.title,
            description: listing.description,
            price: listing.price
        }
    });

    useEffect(() => {
        setValue('title', listing.title);
        setValue('description', listing.description);
        setValue('price', listing.price);
    }, [listing, setValue]);

    const handleFormSubmit = (data: FieldValues) => {
        onSubmit(listing.id, data);
    };

    const body = (
        <div className="flex flex-col gap-4">
            <Input
                id="title"
                label="Title"
                register={register}
                errors={errors}
                required
            />
            <Input
                id="description"
                label="Description"
                register={register}
                errors={errors}
                required
            />
            <Input
                id="price"
                label="Price"
                formatPrice
                type="number"
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit(handleFormSubmit)}
            title="Update Listing"
            body={body}
            actionlabel="Save"
        />
    );
};

export default UpdateModal;