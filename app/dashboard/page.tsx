'use client';
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CustomInputModal } from "@/components/customModal";
import FriendRequests from "@/components/FriendRequests";
import useAuth from "@/hooks/useAuth";


interface FriendRequest {
    id: number;
    sender: User;
    status: string; // PENDING, ACCEPTED, DECLINED
}

interface Friend {
    username: string;
    status: string; // ONLINE, OFFLINE, IN_GAME
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
    friends: Friend[];
    status: string; // ONLINE, OFFLINE, IN_GAME
}

const DashboardPage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [leaders, setLeaders] = useState<User[]>([]);
    const [pendingInvitations, setPendingInvitations] = useState<GameInvitation[]>([]);
    const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [isInvitationsModalOpen, setIsInvitationsModalOpen] = useState(false);
    const [newFriendUsername, setNewFriendUsername] = useState<string>('');
    const apiService = useApi();

    useEffect(()=> {
        setToken(localStorage.getItem("token"));
        setUsername(localStorage.getItem("username"));
        setUserId(localStorage.getItem("userId"));
    }, []);

    // Fetch pending friend requests and game invitations
    useEffect(() => {
        if (!token) return;
        const fetchUpdates = () => {
            apiService.get<User[]>(`/users?userId=${userId}`)
                .then((data) => {
                    const user = (data[0] || {}) as User;
                    const friendsList = (user.friends || []).map((friend) => ({
                        username: friend.username,
                        status: friend.status,
                    }));
                    setFriends(friendsList);
                })
                .catch((error) => console.error('Error fetching friends:', error));

            apiService.get<User[]>('/users?leaderboard=true')
                .then((data) => setLeaders(data))
                .catch((error) => console.error('Error fetching leaderboard data:', error));

            apiService.get<GameInvitation[]>(`/games/invitations/${userId}`)
            .then((data) => {
                const pending = data.filter((invitation) => invitation.status === "PENDING");
                setPendingInvitations(pending);
            })
            .catch((error) => console.error('Error fetching game invitations:', error));
        };

        fetchUpdates();
        const intervalId = setInterval(fetchUpdates, 5000);

        return () => clearInterval(intervalId);
    }, [apiService, userId, token]);

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
              message: "Hello, I would like to be your friend!" // Not displayed in the UI
             }
        )
            .then((data) => {
                setSentRequests([...sentRequests, data]);
                setNewFriendUsername('');
                setIsAddFriendModalOpen(false);
            })
            .catch((error) => console.error('Error sending friend request:', error));
    };

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

    const handlePlayWithFriend = async (friendUsername: string) => {
        try {
            // Create a new game lobby
            const response = await apiService.post<Game>("/games", {});
            if (response.id) {
                // Send a game invitation to the friend
                await apiService.post<GameInvitation>("/games/invitations", {
                    gameId: response.id,
                    targetUsername: friendUsername,
                });
    
                router.push(`/lobby/${response.id}`);
            }
        } catch (error) {
            console.error("Error creating game or sending invitation:", error);
            alert(`Could not start a game with ${friendUsername}: ${(error as Error).message}`);
        }
    };

    // Function to accept or decline game invitations
    const handleInvitation = async (invitationId: number, action: 'play' | 'decline') => {
        const status = action === 'play' ? 'ACCEPTED' : 'DECLINED';
        
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
            clearToken();
            clearId();
            clearUsername();
            router.push("/"); // to login
        } catch (error) {
            console.error("Error during logout:", error);
        };

    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
        return null;
    }

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
                    <FriendRequests />
                </div>
            </header>


            <div className="dashboard-container">
                <div className="dashboard-section">
                    <h2>Friends List</h2>
                    <div className="friends-list">
                    <ul>
                        {friends.map((friend) => (
                            <li key={friend.username} className="friend-item">
                                <img src="/User_Icon.jpg" alt="User Icon" className="user-icon" />
                                <span className="username">{friend.username}</span>
                                <span 
                                    className={`status-circle ${friend.status.toLowerCase()}`}
                                    title={friend.status}    
                                ></span>
                                <img
                                    src="/PlayIcon.png"
                                    alt="Play Icon"
                                    className="play-icon"
                                    onClick={() => handlePlayWithFriend(friend.username)}
                                    title={`Play with ${friend.username}`}
                                />
                            </li>
                        ))}
                    </ul>
                    </div>
                <button 
                    className="add-friend-button" 
                    onClick={() => setIsAddFriendModalOpen(true)}>
                        Add Friend
                </button>
                </div>
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
                                {leaders.slice(0, 1).map((leader) => (
                                    <div className="leader" key={leader.id}>
                                        <img src={"/Gold.png"} alt="Rank 1" />
                                        <span className="username">{leader.username}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="leaderboard-row">
                                {leaders.slice(1, 3).map((leader, index) => (
                                    <div className="leader" key={leader.id}>
                                        <img
                                            src={index === 0 ? "/Silver.png" : "/Bronze.png"}
                                            alt={`Rank ${index + 2}`}
                                        />
                                        <span className="username">{leader.username}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button 
                        className="show-more-button"
                        onClick={() => router.push("/leaderboard")}
                    >Show more</button>
                </div>
                {isInvitationsModalOpen && (
                  <div className="modal-overlay">
                      <div className="modal">
                          <h2>Invitations</h2>
                          {pendingInvitations.length > 0 ? (
                             <ul>
                                 {pendingInvitations.map((invitation) => (
                                     <li key={invitation.id} className="invitations-row">
                                         <span className="friend-username">{invitation.sender.username}</span>
                                         <div className="modal-buttons">
                                         <button className="modal-button-green" onClick={() => handleInvitation(invitation.id, 'play')}>
                                             Play
                                         </button>
                                            <button className="modal-button-red" onClick={() => handleInvitation(invitation.id, 'decline')}>
                                                Decline
                                            </button>
                                        </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No pending Invitations.</p>
                            )}
                            <button className="modal-button-gold" onClick={() => setIsInvitationsModalOpen(false)}>Close</button>
                       </div>
                 </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
