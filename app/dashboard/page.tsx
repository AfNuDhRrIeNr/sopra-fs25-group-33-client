'use client';
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CustomInputModal } from "@/components/customModal"; // Import CustomInputModal


interface FriendRequest {
    id: number;
    sender: User;
    status: string; // PENDING, ACCEPTED, DECLINED
}

interface Friend {
    name: string;
}

// TODO logic for Leaderboard (currently hardcoded)
interface LeaderboardPlayer {
    rank: number;
    name: string;
}

interface Game {
    id: number;
    host: string;
    status: string;
}

interface GameInvitation {
    id: number;
    sender: User;
    game: Game;
    status: string; // PENDING, ACCEPTED, DECLINED
}

interface User {
    token: string;
    id: number;
    username: string;
    friends: string[]; // List of usernames
    status: string; // ONLINE, OFFLINE, IN_GAME
}

const DashboardPage: React.FC = () => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [leaderboard] = useState<LeaderboardPlayer[]>([
        { rank: 1, name: 'Monica' },
        { rank: 2, name: 'Daniel' },
        { rank: 3, name: 'Marcel' },
    ]);
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [pendingInvitations, setPendingInvitations] = useState<GameInvitation[]>([]);
    const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [isPendingRequestsModalOpen, setIsPendingRequestsModalOpen] = useState(false);
    const [isInvitationsModalOpen, setIsInvitationsModalOpen] = useState(false);
    const [newFriendUsername, setNewFriendUsername] = useState<string>('');
    const apiService = useApi();

    //fetch user info from localstorage
    useEffect(()=> {
        setToken(localStorage.getItem("token"));
        setUsername(localStorage.getItem("username"));
        setUserId(localStorage.getItem("userId"));
    }, []);

    // Fetch pending friend requests and game invitations regularly
    useEffect(() => {
        if (!token) return; // Skip polling if token is not available
        const fetchUpdates = () => {
            apiService.get<FriendRequest[]>(`/users/friendRequests`)
                .then((data) => {
                    // Filter only PENDING friend requests
                    const pending = data.filter((request) => request.status === "PENDING");
                    setPendingRequests(pending);
                })
                .catch((error) => console.error('Error fetching friend requests:', error));
            
            apiService.get<User[]>(`/users?userId=${userId}`)
                .then((data) => {
                    const user = (data[0] || {}) as User;
                    const friendsList = (user.friends || []).map((username) => ({
                        name: username, // Map the username to the Friend interface
                    }));
                    setFriends(friendsList); // Update the friends state
                })
                .catch((error) => console.error('Error fetching friends:', error));
            
            apiService.get<GameInvitation[]>(`/games/invitations/${userId}`)
            .then((data) => {
                const pending = data.filter((invitation) => invitation.status === "PENDING");
                setPendingInvitations(pending);
            })
            .catch((error) => console.error('Error fetching game invitations:', error));
        };

        fetchUpdates(); // Initial fetch
        const intervalId = setInterval(fetchUpdates, 5000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [apiService, userId, token]);

    // Function to send a friend request
    const sendFriendRequest = () => {
        if (!newFriendUsername.trim()) {
            alert('Please enter a valid username.');
            return;
        } else if (newFriendUsername.trim() === username) {
            alert('You cannot send a friend request to yourself.');
            return;
        };

        apiService.post<FriendRequest>(
            '/users/friendRequests', 
            { targetUsername: newFriendUsername,
              message: "Hello, I would like to be your friend!" // Not displayed in the UI jet
             }
        )
            .then((data) => {
                setSentRequests([...sentRequests, data]);
                setNewFriendUsername(''); // Reset input
                setIsAddFriendModalOpen(false); // Close modal
            })
            .catch((error) => console.error('Error sending friend request:', error));
    };

    // Function to accept or decline a friend request
    const handleFriendRequest = (requestId: number, action: 'accept' | 'decline') => {
        const status = action === 'accept' ? 'ACCEPTED' : 'DECLINED';
        
        // Optimistically update the UI by removing the request from the pending list
        const updatedPendingRequests = pendingRequests.filter((req) => req.id !== requestId);
        setPendingRequests(updatedPendingRequests);

        apiService.put<string>(
            `/users/friendRequests/${requestId}`,
            { "status": status }
        )
            .then(() => {
                if (action === 'accept') {
                    const acceptedRequest = pendingRequests.find((req) => req.id === requestId);
                    if (acceptedRequest) {
                        setFriends([...friends, { name: acceptedRequest?.sender.username }]); // Add to friends list
                    }
                }
            })
            .catch((error) => {
                console.error(`Error handling friend request (${action}):`, error);
                alert(`Failed to ${action} the friend request`);
                // Revert optimistic update in case of an error
                setPendingRequests([...pendingRequests, pendingRequests.find((req) => req.id === requestId)!]);
            });
    };


    // Function to create a new game state
    const createGamestate = async () => {
        try {
            const response = await apiService.post<Game>(
                "/games",
                {}
            );
        
            if (response.id) {
                router.push(`/lobby/${response.id}`);
            }
        } catch (error) {
            console.error("Error creating lobby:", error);
            alert(`Could not create lobby: ${(error as Error).message}`);
        }
    };

    // Function to accept or decline game invitations
    const handleInvitation = async (invitationId: number, action: 'play' | 'decline') => {
        const status = action === 'play' ? 'ACCEPTED' : 'DECLINED';
        
        // Optimistically update the UI by removing the invitation from the pending list
        const updatedPendingInvitations = pendingInvitations.filter((invitation) => invitation.id !== invitationId);
        setPendingInvitations(updatedPendingInvitations);

        try {
            const response = await apiService.put<GameInvitation>(
                `/games/invitations/${invitationId}`, 
                { "status": status }
            );
            if (action === 'play' && response.game.id) {
                // Redirect to the correct lobby
                router.push(`/lobby/${response.game.id}`);
            }
        } catch (error) {
            console.error(`Error handling game invitation (${action}):`, error);
            alert(`Failed to ${action} the game invitation`);
            setPendingInvitations([...updatedPendingInvitations, pendingInvitations.find((invitation) => invitation.id === invitationId)!]);
        };

    };

    // Function to handle click on user icon
    const handleIconClick = () => {
        setIsPendingRequestsModalOpen(true);
    };

    // Constants to clear local storage
    const {
        clear: clearToken
      } = useLocalStorage<string>("token", "");
      
      const {
        clear: clearId
      } = useLocalStorage<string>("userId", "");
      
      const {
        clear: clearUsername
      } = useLocalStorage<string>("username", "");
      
    // Function to handle logout
    const handleLogoutClick = async () => {
        try {
            await apiService.put<User>(
                "/users/logout", 
                {}
            );
            clearToken(); // Clear the token
            clearId();
            clearUsername();
            router.push("/"); // Redirect to login
        } catch (error) {
            console.error("Error during logout:", error);
        };

    };


    return (
        <div className="dashboard-page">
            <header>
                  <button 
                  className = "nav_button"
                  onClick={handleLogoutClick}
                  style = {{ backgroundColor: '#D04949', left: 0, marginLeft: '1vw'}}
                  >
                    Logout
                  </button>
            
                  <div className = "Title">
                    ScrabbleNow
                  </div>
            
                  <div className="userSnippet">
                    <span className="username">
                      {username}
                    </span>
                    <div className='user-icon'>
                    <Image
                      className = "icon"
                      src="/User_Icon.jpg"
                      alt="User Icon"
                      width={100}
                      height={100}
                      priority
                      onClick={handleIconClick} // Open pending requests Modal
                      style = {{cursor: "pointer"}}
                      />
                      {pendingRequests.length > 0 && <div className="notification-dot"></div>}
                    </div>
                </div>
            </header>


            <div className="dashboard-container">
                <div className="dashboard-section">
                    <h2>Friends List</h2>
                    <div className="friends-list">
                        <ul>
                            {friends.map((friend) => (
                                <li key={friend.name}>
                                    <img src="/User_Icon.jpg" alt="User Icon" />
                                    {friend.name} {/* Display the friend's name */}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="add-friend-button" onClick={() => setIsAddFriendModalOpen(true)}>Add Friend</button>
                </div>
                {/* CustomInputModal for Adding Friend */}
                <CustomInputModal
                    visible={isAddFriendModalOpen}
                    title="New Friend Request"
                    placeholder="Enter Friend's Username"
                    inputValue={newFriendUsername}
                    onInputChange={(e) => setNewFriendUsername(e.target.value)}
                    onSubmit={sendFriendRequest}
                    onCancel={() => setIsAddFriendModalOpen(false)}
                />
                <div className="dashboard-section">
                    <h2>ScrabbleNow!</h2>
                    <div className="scrabble-now">
                        <div className="scrabble-board">
                        {pendingInvitations.length > 0 && (<button className="invitations-button" onClick={() => setIsInvitationsModalOpen(true)}>Invitations</button>)}
                            <img src="/Board.jpg" alt="Scrabble Board" />
                        </div>
                    </div>
                    <button className="create-game-button" onClick = {createGamestate} >Create Game</button>
                </div>
                <div className="dashboard-section">
                    <h2>Leaderboard</h2>
                    <div className="leaderboard">
                        <div className="leaderboard-list">
                            <div className="leaderboard-row">
                                {leaderboard
                                    .filter((player) => player.rank === 1)
                                    .map((player) => (
                                        <div className="leader" key={player.rank}>
                                            <img src={"/Gold.png"}/>
                                            {player.name}
                                        </div>
                                    ))}
                            </div>
                            <div className="leaderboard-row">
                                {leaderboard
                                    .filter((player) => player.rank === 2 || player.rank === 3)
                                    .map((player) => (
                                        <div className="leader" key={player.rank}>
                                            <img src={player.rank === 2 ? "/Silver.png" : "/Bronze.png" }/>
                                            {player.name}
                                        </div>
                                    ))
                                    }
                            </div>
                        </div>
                    </div>
                    <button 
                        className="show-more-button"
                        onClick={() => router.push("/leaderboard")}
                    >Show more</button>
                </div>
                {/* Modal for Pending Friend Requests */}
                {isPendingRequestsModalOpen && (
                  <div className="modal-overlay">
                      <div className="modal">
                          <h2>Pending Friend Requests</h2>
                          {pendingRequests.length > 0 ? (
                             <ul>
                                 {pendingRequests.map((request) => (
                                     <li key={request.id} className='friend-request-row'>
                                         <img 
                                         src="/User_Icon.jpg" 
                                         alt="User Icon"
                                         className='modal-avatar'
                                         />
                                         <span className='friend-username'>{request.sender.username}</span>
                                         <div className='modal-buttons'>
                                         <button className='modal-button-green' onClick={() => handleFriendRequest(request.id, 'accept')}>
                                             Accept
                                         </button>
                                            <button className='modal-button-red' onClick={() => handleFriendRequest(request.id, 'decline')}>
                                                Decline
                                            </button>
                                        </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No pending friend requests.</p>
                            )}
                            <button className='modal-button-gold' onClick={() => setIsPendingRequestsModalOpen(false)}>Close</button>
                       </div>
                 </div>
                )}
                {/* Modal for Game Invitations */}
                {isInvitationsModalOpen && (
                  <div className="modal-overlay">
                      <div className="modal">
                          <h2>Invitations</h2>
                          {pendingInvitations.length > 0 ? (
                             <ul>
                                 {pendingInvitations.map((invitation) => (
                                     <li key={invitation.id} className='invitations-row'>
                                         <span className='friend-username'>{invitation.sender.username}</span>
                                         <div className='modal-buttons'>
                                         <button className='modal-button-green' onClick={() => handleInvitation(invitation.id, 'play')}>
                                             Play
                                         </button>
                                            <button className='modal-button-red' onClick={() => handleInvitation(invitation.id, 'decline')}>
                                                Decline
                                            </button>
                                        </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No pending Invitations.</p>
                            )}
                            <button className='modal-button-gold' onClick={() => setIsInvitationsModalOpen(false)}>Close</button>
                       </div>
                 </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
