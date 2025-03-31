'use client';
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import Image from "next/image";
import { useApi } from "@/hooks/useApi";


interface Friend {
    id: number;
    name: string;
    avatar: string; // URL for the avatar image
}

interface LeaderboardPlayer {
    rank: number;
    name: string;
}

const DashboardPage: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
    const [sentRequests, setSentRequests] = useState<Friend[]>([]);
    const [isSendFriendModalOpen, setIsSendFriendModalOpen] = useState(false);
    const [isPendingRequestsModalOpen, setIsPendingRequestsModalOpen] = useState(false);
    const [newFriendUsername, setNewFriendUsername] = useState<string>('');

    const apiService = useApi();


    // Fetch pending friend requests on component mount
    useEffect(() => {
        apiService.get<Friend[]>('/friend-requests')
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

        apiService.post<Friend>('/friend-request', { username: newFriendUsername })
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
        apiService.put<Friend>(`/friend-request/${requestId}`, { action })
            .then((data) => {
                alert(`Friend request ${action}ed!`);
                setPendingRequests(pendingRequests.filter((req) => req.id !== requestId));
                if (action === 'accept') {
                    setFriends([...friends, data]);
                }
            })
            .catch((error) => console.error(`Error ${action}ing friend request:`, error));
    };

    const handleIconClick = () => {
        setIsPendingRequestsModalOpen(true);
    };

    const handleLogoutClick = () => {
        alert("Logout clicked!")
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
                      {"Guest"/* {username || "Guest"} */}
                    </span>
            
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
                    <button className="create-game-button">Create Game</button>
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
                            <input
                                type="text"
                                placeholder="Enter Friend's Username"
                                value={newFriendUsername}
                                onChange={(e) => setNewFriendUsername(e.target.value)}
                            />
                            <button onClick={sendFriendRequest}>Send Request</button>
                            <button onClick={() => setIsSendFriendModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                )}
                {/* Modal for Pending Friend Requests */}
                {isPendingRequestsModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Pending Friend Requests</h2>
                            <ul>
                                {pendingRequests.map((request) => (
                                    <li key={request.id}>
                                        <img src={request.avatar} alt={`${request.name}'s Avatar`} />
                                        {request.name}
                                        <button onClick={() => handleFriendRequest(request.id, 'accept')}>
                                            Accept
                                        </button>
                                        <button onClick={() => handleFriendRequest(request.id, 'decline')}>
                                            Decline
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => setIsPendingRequestsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;