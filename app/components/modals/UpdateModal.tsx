'use client';
import { useEffect, useCallback } from "react";
import { SafeListing } from "@/app/types";
import Modal from "./Modal";
import Input from "../inputs/Input";
import { 
    FieldValues,
    useForm
} from 'react-hook-form';
import ImageUpload from "../inputs/ImageUpload";

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, updatedListing: Partial<SafeListing>) => void;
    listing: SafeListing;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    listing }) => {
    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<FieldValues>({
        defaultValues: {
            title: listing.title,
            description: listing.description,
            price: listing.price,
            imageSrc: listing.imageSrc
        }
    });
    const imageSrc = watch('imageSrc');

    useEffect(() => {
        setValue('title', listing.title);
        setValue('description', listing.description);
        setValue('price', listing.price);
        setValue('imageSrc', listing.imageSrc);
    }, [listing, setValue]);

    const handleFormSubmit = (data: FieldValues) => {
        onSubmit(listing.id, data);
    };
    const handleUpload = useCallback((value: string) => {
        setValue('imageSrc', value, { shouldValidate: true });
    }, [setValue]);

 
    const body = (
        <div className="flex flex-col gap-4">
            <ImageUpload value={imageSrc} onChange={handleUpload} />
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