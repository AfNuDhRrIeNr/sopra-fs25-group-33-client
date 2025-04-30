'use client';
import React, { useEffect, useState } from 'react';
import { useApi } from "@/hooks/useApi";
import './leaderboard.css';
import Image from "next/image";

interface User {
    username: string;
    highscore: number;
}

const LeaderboardPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        { username: 'User1', highscore: 100 },
        { username: 'User2', highscore: 200 },
        { username: 'User3', highscore: 300 },
        { username: 'User4', highscore: 400 },
        { username: 'User5', highscore: 500 },
        { username: 'User6', highscore: 600 },
        { username: 'User7', highscore: 700 },
        { username: 'User8', highscore: 800 },
        { username: 'User9', highscore: 900 },
        { username: 'User10', highscore: 1000 }
    ]);
    const apiService = useApi();
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    
    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        setToken(localStorage.getItem("token"));
    }, []);

    /*
    useEffect(() => {
        apiService.get<User[]>('/users/leaderboard')
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching leaderboard data:', error));
    }, [apiService]);
    */
    return (
        <div className="leaderboard-page">
            <header>
                  <button 
                  className = "nav_button"
                  //onClick={handleButtonClick}
                  style = {{ backgroundColor: '#D04949', left: 0, marginLeft: '1vw'}}
                  >
                    Leave
                  </button>
            
                  <div className = "Title">
                    ScrabbleNow
                  </div>
            
                  <div className="userSnippet">
                    <span className="username">
                      {username}
                    </span>
            
                    <Image
                      className = "icon"
                      src="/User_Icon.jpg"
                      alt="User Icon"
                      width={100}
                      height={100}
                      priority
                      //onClick={handleIconClick}
                      style = {{cursor: "pointer"}}
                      />
                  </div>
                </header>
            <div className="leaderboard-container">
                <h2>Leaderboard</h2>
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>User Icon</th>
                            <th>Username</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>
                                    <Image
                                        src="/User_Icon.jpg"
                                        alt="User Icon"
                                        width={50}
                                        height={50}
                                    />
                                </td>
                                <td>{user.username}</td>
                                <td>{user.highscore}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardPage;
