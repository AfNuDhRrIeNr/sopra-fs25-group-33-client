'use client';
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useEffect, useState } from 'react';
import { useApi } from "@/hooks/useApi";
import './leaderboard.css';
import Image from "next/image";
import FriendRequests from "@/components/FriendRequests";

interface User {
    token: string;
    id: number;
    username: string;
    status: string; // ONLINE, OFFLINE, IN_GAME
    highScore: number;
    friends: string[];
}

interface Friend {
    username: string;
}

const LeaderboardPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const apiService = useApi();
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        setUserId(localStorage.getItem("userId"));
        setToken(localStorage.getItem("token"));
    }, []);

    const handleButtonClick = () => {
        router.push("/dashboard");
    };

    useEffect(() => {
        if (!token) return; // Ensure userId is available before making the API call

        apiService.get<User[]>('/users?leaderboard=true')
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching leaderboard data:', error));

        apiService.get<User[]>(`/users?userId=${userId}`)
            .then((data) => {
                if (data.length > 0) {
                    const user = data[0] as User;
                    const friendsList = (user.friends || []).map((username) => ({
                        username: username, // Map the username to the Friend interface
                    }));
                    setFriends(friendsList); // Update the friends state
                } else {
                    console.error('No user data found for the given userId.');
                }
            })
            .catch((error) => console.error('Error fetching friends:', error));
    }, [apiService, userId, friends]);

    const friendsLeaderboard = users.filter(
        (user) => friends.some((friend) => friend.username === user.username) || user.username === username
    );

    const handleFriendAdded = (friend: User) => {
        setFriends([...friends, { username: friend.username }]);
    };

    return (
        <div className="leaderboard-page">
            <header>
                <button 
                    className="nav_button"
                    onClick={handleButtonClick}
                    style={{ backgroundColor: '#D04949', left: 0, marginLeft: '1vw' }}
                >
                    Back
                </button>
                <div className="Title">ScrabbleNow</div>
                <div className="userSnippet">
                    <span className="username">{username}</span>
                    <FriendRequests 
                        onFriendAdded={handleFriendAdded} 
                    />
                </div>
            </header>
            <div className="leaderboard-container">
                <div className="leaderboard-section">
                    <h2>Friends Leaderboard</h2>
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>User Info</th>
                                <th>Highscore</th>
                            </tr>
                        </thead>
                        <tbody>
                            {friendsLeaderboard.map((user, index) => (
                                <tr key={index}>
                                    <td className="user-info">
                                        <Image
                                            src={
                                                index === 0
                                                    ? "/Gold.png"
                                                    : index === 1
                                                    ? "/Silver.png"
                                                    : index === 2
                                                    ? "/Bronze.png"
                                                    : "/User_Icon.jpg"
                                            }
                                            alt={
                                                index === 0
                                                    ? "Gold Medal"
                                                    : index === 1
                                                    ? "Silver Medal"
                                                    : index === 2
                                                    ? "Bronze Medal"
                                                    : "User Icon"
                                            }
                                            width={50}
                                            height={50}
                                            style={{
                                                width: "auto",
                                                height: "auto",
                                                maxWidth: "50px",
                                                maxHeight: "50px",
                                            }}
                                        />
                                        <span>{user.username}</span>
                                    </td>
                                    <td>{user.highScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="leaderboard-section">
                    <h2>Global Leaderboard</h2>
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>User Info</th>
                                <th>Highscore</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td className="user-info">
                                        <Image
                                            src={
                                                index === 0
                                                    ? "/Gold.png"
                                                    : index === 1
                                                    ? "/Silver.png"
                                                    : index === 2
                                                    ? "/Bronze.png"
                                                    : "/User_Icon.jpg"
                                            }
                                            alt={
                                                index === 0
                                                    ? "Gold Medal"
                                                    : index === 1
                                                    ? "Silver Medal"
                                                    : index === 2
                                                    ? "Bronze Medal"
                                                    : "User Icon"
                                            }
                                            width={50}
                                            height={50}
                                            style={{
                                                width: "auto",
                                                height: "auto",
                                                maxWidth: "50px",
                                                maxHeight: "50px",
                                            }}
                                        />
                                        <span>{user.username}</span>
                                    </td>
                                    <td>{user.highScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
