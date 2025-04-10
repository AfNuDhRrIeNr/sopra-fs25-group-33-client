'use client';
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";


// TODO implement API calls and actual logic for friend requests, game invitations
/*
interface Friend {
    id: number;
    sender: User;
    avatar: string; // Not provided by API, use a default image
}*/

interface FriendRequest {
    id: number;
    sender: User;
    avatar: string; // Not provided by API, use a default image
}

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
    status: string;
}

interface User {
    token: string;
    id: number;
    username: string;
    friends: Set<User>;
}

const DashboardPage: React.FC = () => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [friends, setFriends] = useState<FriendRequest[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([
        { rank: 1, name: 'Monica' },
        { rank: 2, name: 'Daniel' },
        { rank: 3, name: 'Marcel' },
    ]);
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([/*{
        id: 1,
        sender: {id: 1, token: "", username: "Marco"},
        avatar: "/User_Icon.jpg" 
        },{
            id: 2,
            sender: {id: 2, token: "", username: "Sebastiano"},
            avatar: "/User_Icon.jpg"
            }*/]);
    const [pendingInvitations, setPendingInvitations] = useState<GameInvitation[]>([/*{
        id: 1,
        sender: { token: "", id: 1, username: "Marco" },
        status: "pending",
        },{
            id: 2,
            sender: { token: "", id: 2, username: "Sebastiano" },
            status: "pending",
            }*/]);
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
        const fetchUpdates = () => {
            apiService.get<FriendRequest[]>(`/users/friendRequests/${userId}`) // Fetch pending friend requests
            .then((data) => setPendingRequests(data))
            .catch((error) => console.error('Error fetching friend requests:', error));

            // TODO define query parameter to get the own User info
            apiService.get<User>(`/users?user=${userId}`) // Fetch the user info to get friends
                .then((data) => {
                    const friendsList = Array.from(data.friends).map((friend) => ({
                        id: friend.id,
                        sender: friend,
                        avatar: "/User_Icon.jpg", // Use a default avatar
                    }));
                    setFriends(friendsList);
                })
                .catch((error) => console.error('Error fetching friends:', error));

            apiService.get<GameInvitation[]>(`/games/invitations/${userId}`)
                .then((data) => setPendingInvitations(data))
                .catch((error) => console.error('Error fetching game invitations:', error));
        };

        fetchUpdates(); // Initial fetch
        const intervalId = setInterval(fetchUpdates, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [apiService, userId]);

    // Function to send a friend request
    const sendFriendRequest = () => {
        if (!newFriendUsername.trim()) {
            alert('Please enter a valid username.');
            return;
        }

        apiService.post<FriendRequest>('/users/friendRequests', { username: newFriendUsername })
            .then((data) => {
                alert('Friend request sent!');
                setSentRequests([...sentRequests, data]);
                setNewFriendUsername(''); // Reset input
                setIsAddFriendModalOpen(false); // Close modal
            })
            .catch((error) => console.error('Error sending friend request:', error));
    };

    // Function to accept or decline a friend request
    const handleFriendRequest = (requestId: number, action: 'accept' | 'decline') => {
        if (action === 'accept') {
            const acceptedRequest = pendingRequests.find((req) => req.id === requestId);
            if (acceptedRequest) {
                setFriends([...friends, acceptedRequest]); // Add to friends list
            }
            apiService.put<String>(`/users/friendRequests/${requestId}`, { status: 'ACCEPTED' })
                .then(() => {
                    alert('Friend request accepted!');
                })
                .catch((error) => {
                    console.error('Error accepting friend request:', error);
                    alert('Failed to accept the friend request');
                });
        }
        setPendingRequests(pendingRequests.filter((req) => req.id !== requestId)); // Remove from pending requests
    };

    // Function to create a new game state
    const createGamestate = async () => {
        try {
              const response = await apiService.post<Game>("/games", token);
        
              if (response.id) {
                router.push(`/lobby/${response.id}`);

            }} catch (error) {
                console.error("Error creating lobby:", error);
                alert(`Could not create lobby: ${(error as Error).message}`);
              }
            };

    // Function to accept or decline game invitations
    const handleInvitation = async (gameId: number, action: 'play' | 'decline') => {
        try {
            if (action === 'play') {
                // Navigate to the game lobby
                router.push(`/lobby/${gameId}`);
                // TODO Call API to accept the invitation
                await apiService.put<GameInvitation>(`/games/invitations/${gameId}`, { status: 'ACCEPTED' });
            } else if (action === 'decline') {
                // TODO Call API to decline the invitation
                await apiService.put<GameInvitation>(`/games/invitations/${gameId}`, { status: 'DECLINED' });
            }
            // Update the invitations array to remove the handled invitation
            setPendingInvitations(pendingInvitations.filter(invitation => invitation.id !== gameId));
        } catch (error) {
            console.error(`Error handling invitation (${action}):`, error);
            alert(`Failed to ${action} the invitation.`);
        }
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
            await apiService.put<User>("users/logout", token)          
            clearToken(); // Clear the token
            clearId();
            clearUsername();
            router.push("/login"); // Redirect to login
        } catch (error) {
            console.error("Error during logout:", error);
        }
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
                                <li key={friend.id}>
                                    <img src={friend.avatar} alt={`${friend.sender.username}'s Avatar`} />
                                    {friend.sender.username}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="add-friend-button" onClick={() => setIsAddFriendModalOpen(true)}>Add Friend</button>
                </div>
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
                                            <img src={player.rank === 2 ? "Silver.png" : "Bronze.png" }/>
                                            {player.name}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <button className="show-more-button">Show more</button>
                </div>
                {/* Modal for Adding Friend */}
                {isAddFriendModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Add Friend</h2>
                            <div className="modal-input-container">
                            <input
                                type="text"
                                placeholder="Enter Friend's Username"
                                value={newFriendUsername}
                                onChange={(e) => setNewFriendUsername(e.target.value)}
                            />
                            <div className='modal-buttons'>
                            <button className='modal-button-green' onClick={sendFriendRequest}>Send Request</button>
                            <button className='modal-button-red' onClick={() => setIsAddFriendModalOpen(false)}>Cancel</button>
                            </div>
                            </div>
                        </div>
                    </div>
                )}
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
                                         src={request.avatar} 
                                         alt={`${request.sender.username}'s Avatar`}
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