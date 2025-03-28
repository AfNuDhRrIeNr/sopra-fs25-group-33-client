'use client';
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import Image from "next/image";


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


    const handleIconClick = () => {
        alert("Icon clicked!");
    };

    const handleLogoutClick = () => {
        alert("Logout clicked!")
    }

    useEffect(() => {
        // Hardcoded list of friends
        const hardcodedFriends: Friend[] = [
            { id: 1, name: 'Marcus', avatar: '/User_Icon.jpg' },
            { id: 2, name: 'Monica', avatar: '/User_Icon.jpg' },
            { id: 3, name: 'Daniel', avatar: '/User_Icon.jpg' },
            { id: 4, name: 'Marcel', avatar: '/User_Icon.jpg' },
            { id: 5, name: 'Thomas', avatar: '/User_Icon.jpg' },
            { id: 6, name: 'Marc', avatar: '/User_Icon.jpg' },

        ];
        setFriends(hardcodedFriends);

        // Hardcoded leaderboard
        const hardcodedLeaderboard: LeaderboardPlayer[] = [
            { rank: 1, name: 'Monica' },
            { rank: 2, name: 'Daniel' },
            { rank: 3, name: 'Marcel' },
        ];
        setLeaderboard(hardcodedLeaderboard);
    }, []);

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
                      onClick={handleIconClick}
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
                    <button className="add-friend-button">Add Friend</button>
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
            </div>
        </div>
    );
};

export default DashboardPage;