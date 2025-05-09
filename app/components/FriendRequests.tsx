import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { CustomListModal } from "./customModal"; // Import CustomListModal

interface User {
    token: string;
    id: number;
    username: string;
    status: string; // ONLINE, OFFLINE, IN_GAME
    highScore: number;
    friends: Friend[];
}

interface FriendRequest {
    id: number;
    sender: User;
    status: string; // PENDING, ACCEPTED, DECLINED
}

interface Friend {
        username: string;
        status: string; // ONLINE, OFFLINE, IN_GAME
}

const FriendRequests: React.FC = () => {
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const apiService = useApi();

    useEffect(() => {
        if (!localStorage.getItem("token")) return;
        const fetchFriendRequests = () => {
            apiService.get<FriendRequest[]>('/users/friendRequests')
                .then((data) => {
                    const pending = data.filter((request) => request.status === "PENDING");
                    setPendingRequests(pending);
                })
                .catch((error) => console.error('Error fetching friend requests:', error));
        };

        fetchFriendRequests();
        const interval = setInterval(fetchFriendRequests, 5000); // Poll every 5 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [apiService]);

    const handleFriendRequest = (requestId: number, action: 'accept' | 'decline') => {
        const status = action === 'accept' ? 'ACCEPTED' : 'DECLINED';

        // Optimistically update the UI
        const updatedPendingRequests = pendingRequests.filter((req) => req.id !== requestId);
        setPendingRequests(updatedPendingRequests);

        apiService.put<string>(`/users/friendRequests/${requestId}`, { status })
            .then(() => {
                if (action === 'accept') {
                    // Removed onFriendAdded callback
                }
            })
            .catch((error) => {
                console.error(`Error handling friend request (${action}):`, error);
                alert(`Failed to ${action} the friend request`);
                // Revert optimistic update
                setPendingRequests([...pendingRequests, pendingRequests.find((req) => req.id === requestId)!]);
            });
    };

    return (
        <>
            <Image
                className="icon"
                src="/User_Icon.jpg"
                alt="User Icon"
                width={100}
                height={100}
                priority
                onClick={() => setIsModalOpen(true)} // Open modal
                style={{ cursor: "pointer" }}
            />
            {pendingRequests.length > 0 && <div className="notification-dot"></div>}
            <CustomListModal
                visible={isModalOpen}
                title="Pending Friend Requests"
                items={pendingRequests}
                renderItem={(request) => (
                    <div className="friend-request-row">
                        <Image
                            src="/User_Icon.jpg"
                            alt="User Icon"
                            className="modal-avatar"
                        />
                        <span className="friend-username">{request.sender.username}</span>
                        <div className="modal-buttons">
                            <button
                                className="modal-button-green"
                                onClick={() => handleFriendRequest(request.id, 'accept')}
                            >
                                Accept
                            </button>
                            <button
                                className="modal-button-red"
                                onClick={() => handleFriendRequest(request.id, 'decline')}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                )}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default FriendRequests;
