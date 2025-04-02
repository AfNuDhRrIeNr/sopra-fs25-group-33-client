'use client';
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
// import useLocalStorage from "@/hooks/useLocalStorage";


interface Friend {
    id: number;
    name: string;
    avatar: string; // URL for the avatar image
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

const DashboardPage: React.FC = () => {
    const userId = localStorage.getItem("userId");
    const router = useRouter();
    
    const [friends, setFriends] = useState<Friend[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Friend[]>([/*{
        id: 1,
        name: "Marco",
        avatar: "/User_Icon.jpg" 
    },{
        id: 2,
        name: "Sebastiano",
        avatar: "/User_Icon.jpg"
    }*/]);
    const [sentRequests, setSentRequests] = useState<Friend[]>([]);
    const [isSendFriendModalOpen, setIsSendFriendModalOpen] = useState(false);
    const [isPendingRequestsModalOpen, setIsPendingRequestsModalOpen] = useState(false);
    const [newFriendUsername, setNewFriendUsername] = useState<string>('');

    const apiService = useApi();

    // Fetch pending friend requests on component mount
    useEffect(() => {
        apiService.get<Friend[]>('/users/friendRequests')
            .then((data) => setPendingRequests(data))
            .catch((error) => console.error('Error fetching friend requests:', error));

        // Hardcoded leaderboard
        const hardcodedLeaderboard: LeaderboardPlayer[] = [
            { rank: 1, name: 'Monica' },
            { rank: 2, name: 'Daniel' },
            { rank: 3, name: 'Marcel' },
        ];
        setLeaderboard(hardcodedLeaderboard);

    }, [apiService]);

    // Function to send a friend request
    const sendFriendRequest = () => {
        if (!newFriendUsername.trim()) {
            alert('Please enter a valid username.');
            return;
        }

        apiService.post<Friend>('/users/friendRequests', { username: newFriendUsername })
            .then((data) => {
                alert('Friend request sent!');
                setSentRequests([...sentRequests, data]);
                setNewFriendUsername(''); // Reset input
                setIsSendFriendModalOpen(false); // Close modal
            })
            .catch((error) => console.error('Error sending friend request:', error));
    };
    // Function to accept or decline a friend request
    const handleFriendRequest = (requestId: number, action: 'accept' | 'decline') => {
        apiService.put<Friend>(`/users/friendRequests/${requestId}`, { action })
            .then((data) => {
                alert(`Friend request ${action}`);
                setPendingRequests(pendingRequests.filter((req) => req.id !== requestId));
                if (action === 'accept') {
                    setFriends([...friends, data]);
                }
            })
            .catch((error) => console.error(`${action} failed:`, error));
    };

    const handleIconClick = () => {
        setIsPendingRequestsModalOpen(true);
    };

    const handleLogoutClick = () => {
        alert("Logout clicked!")
    }


    const createGamestate = async () => {
        try {
              const response = await apiService.post<Game>("/games", userId);
        
              if (response.id) {
                router.push(`/lobby/${response.id}`);

            }} catch (error) {
                console.error("Error creating lobby:", error);
                alert(`Could not create lobby: ${(error as Error).message}`);
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
                      {"Guest"/* {username || "Guest"} */}
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
                                    <img src={friend.avatar} alt={`${friend.name}'s Avatar`} />
                                    {friend.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="add-friend-button" onClick={() => setIsSendFriendModalOpen(true)}>Add Friend</button>
                </div>
                <div className="dashboard-section">
                    <h2>ScrabbleNow!</h2>
                    <div className="scrabble-now">
                        <div className="scrabble-board">
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
                {isSendFriendModalOpen && (
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
                            <button className='modal-button-red' onClick={() => setIsSendFriendModalOpen(false)}>Cancel</button>
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
                                         alt={`${request.name}'s Avatar`}
                                         className='modal-avatar'
                                         />
                                         <span className='friend-username'>{request.name}</span>
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
            </div>
        </div>
    );
};

export default DashboardPage;