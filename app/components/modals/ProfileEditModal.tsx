import { useState, useCallback } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import Modal from './Modal';
import Input from '../inputs/Input';
import ImageUpload from '../inputs/ImageUpload';
import { SafeUser } from '../../types';
import { toast } from 'react-hot-toast';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (updatedProfile: Partial<SafeUser>) => void;
    currentUser: SafeUser;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    currentUser
}) => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser.name || '',
            email: currentUser.email || '',
            image: currentUser.image || '',
        }
    });

    const image = watch('image');

    const handleUpload = useCallback((value: string) => {
        setValue('image', value, { shouldValidate: true });
    }, [setValue]);

    const onSubmitHandler: SubmitHandler<FieldValues> = async (data) => {
        try {
            await axios.patch('/api/profile', data);
            toast.success('Profile updated successfully');
            onSubmit(data);
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };
 
    const bodyContent = (
        <div className="flex flex-col gap-4">
            <ImageUpload value={image} onChange={handleUpload} />
            <Input
                id="name"
                label="Name"
                disabled={false}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="email"
                label="Email"
                disabled={false}
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
            onSubmit={handleSubmit(onSubmitHandler)}
            title="Edit Profile"
            actionlabel="Save"
            body={bodyContent}
        />
    );
};

export default ProfileEditModal;
