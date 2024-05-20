'use client';
import axios from 'axios';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import Modal from './Modal';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import { SafeUser } from '@/app/types';

interface PasswordEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: SafeUser;
}

const PasswordEditModal: React.FC<PasswordEditModalProps> = ({
    isOpen,
    onClose
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>();

    const onSubmitHandler: SubmitHandler<FieldValues> = async (data) => {
        try {
            const response = await axios.patch('/api/password', data);
            toast.success(response.data.message);
            onClose();
        } catch (error) {
            toast.error('Failed to update password');
        }
    };

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Input
                id="currentPassword"
                type="password"
                label="Current Password"
                disabled={false}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="newPassword"
                type="password"
                label="New Password"
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
            title="Change Password"
            actionlabel="Save"
            body={bodyContent}
        />
    );
};

export default PasswordEditModal;
