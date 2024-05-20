import getCurrentUser from "../actions/getCurrentUser";
import EmptyState from "../components/EmptyState";
import ProfileClient from "./PorfileClient";



const ProfilePage = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return (
            <EmptyState 
            title="Unauthorized"
            subtitle="Please login"
            />
        );
    }

    return(
        <ProfileClient
            currentUser={currentUser}
        />
    )
};

export default ProfilePage;