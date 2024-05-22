'use client';
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ProfileEditModal from "../components/modals/ProfileEditModal";
import Avatar from "../components/Avatar"; 
import axios from "axios";
import { SafeUser } from "../types";
import PasswordEditModal from "../components/modals/PasswordEditModal";
import { CiEdit } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiLock } from "react-icons/ci";



interface ProfileClientProps {
    currentUser: SafeUser;
}

const ProfileClient: React.FC<ProfileClientProps> = ({
    currentUser
}) => {
    const router = useRouter();
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);

    const handleEditProfile = useCallback(() => {
        setEditingProfile(true);
    }, []);

    const handleSubmitProfile = useCallback(async (updatedProfile: Partial<SafeUser>) => {
        try {
            const requestData = {
                name: updatedProfile.name,
                email: updatedProfile.email,
                image: updatedProfile.image,
            };

            await axios.patch(`/api/profile`, requestData);

            toast.success('Profile updated');
            setEditingProfile(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error?.response?.data?.error || 'Failed to update profile');
        }
    }, [router]);

    const handleChangePassword = useCallback(() => {
        setEditingPassword(true);
    }, []);

    const handleCancelPasswordChange = useCallback(() => {
        setEditingPassword(false);
    }, []);

    return (
        <Container>
            <Heading 
                title="Profile"
                subtitle="Manage your profile information"
            />
            <div className="mt-10 flex flex-col items-start">
                <div className="flex items-center gap-6">
                    <div className="w-40 h-40">
                        <Avatar src={currentUser.image} height={160} width={160} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">{currentUser.name}</h2>
                        <p className="text-xl text-gray-600">{currentUser.email}</p>
                    </div>
                </div>
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={handleEditProfile}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {<span className="flex gap-2 text-lg items-center"><CiEdit className="text-2xl" /> Edit</span> }
                    </button>
                    <button
                        onClick={handleChangePassword}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {<span className="flex gap-2 text-lg items-center"><CiLock className="text-2xl" /> Change Password</span> }
                    </button>
                </div>
            </div>
            {editingProfile && (
                <ProfileEditModal 
                    isOpen={editingProfile} 
                    onClose={() => setEditingProfile(false)} 
                    onSubmit={handleSubmitProfile} 
                    currentUser={currentUser} 
                />
            )}
            {editingPassword && (
                <PasswordEditModal 
                    isOpen={editingPassword} 
                    onClose={() => setEditingPassword(false)} 
                    currentUser={currentUser} 
                />
            )}
        </Container>
    );
};

export default ProfileClient;
