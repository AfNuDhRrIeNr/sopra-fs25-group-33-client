'use client';
import { useParams, useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useEffect, useState } from 'react';
import { useApi } from "@/hooks/useApi";
import './leaderboard.css';
import Image from "next/image";

interface User {
    username: string;
    highScore: number;
    friends: string[];
}

interface Friend {
    name: string;
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
        setToken(localStorage.getItem("token"));
        setUserId(localStorage.getItem("userId"));
    }, []);

    const handleButtonClick = () => {
        router.push("/dashboard");
    };

    useEffect(() => {
        if (!userId) return; // Ensure userId is available before making the API call

        apiService.get<User[]>('/users?leaderboard=true')
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching leaderboard data:', error));

        apiService.get<User[]>(`/users?userId=${userId}`)
            .then((data) => {
                if (data.length > 0) {
                    const user = data[0] as User;
                    const friendsList = (user.friends || []).map((username) => ({
                        name: username, // Map the username to the Friend interface
                    }));
                    setFriends(friendsList); // Update the friends state
                } else {
                    console.error('No user data found for the given userId.');
                }
            })
            .catch((error) => console.error('Error fetching friends:', error));
    }, [apiService, userId]); // Include userId in the dependency array

    const friendsLeaderboard = users.filter(
        (user) => friends.some((friend) => friend.name === user.username) || user.username === username
    );

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
                    <Image
                        className="icon"
                        src="/User_Icon.jpg"
                        alt="User Icon"
                        width={100}
                        height={100}
                        priority
                        style={{ cursor: "pointer" }}
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
                                                width: "auto", // Maintain aspect ratio
                                                height: "auto", // Maintain aspect ratio
                                                maxWidth: "50px", // Limit maximum width
                                                maxHeight: "50px", // Limit maximum height
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
                                                width: "auto", // Maintain aspect ratio
                                                height: "auto", // Maintain aspect ratio
                                                maxWidth: "50px", // Limit maximum width
                                                maxHeight: "50px", // Limit maximum height
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
