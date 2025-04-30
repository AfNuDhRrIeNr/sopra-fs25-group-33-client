'use client';
import { useParams, useRouter } from "next/navigation"; // use NextJS router for navigation
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
        { username: 'Manu', highscore: 100 },
        { username: 'Luca', highscore: 80 },
        { username: 'Lucker', highscore: 70 },
        { username: 'Andr', highscore: 60 },
        { username: 'S', highscore: 30 },
        { username: 'TheUltraMegaSpecialOne', highscore: 4 },
        { username: 'anotherOne', highscore: 3 },
        { username: 'andAgain', highscore: 2 },
    ]);
    const apiService = useApi();
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        setToken(localStorage.getItem("token"));
    }, []);

    const handleButtonClick = () => {
        router.push("/dashboard");
      };
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
                  onClick={handleButtonClick}
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
                                        style={{ height: "auto", width: "auto", maxHeight: "50px", maxWidth: "50px" }} // Allow natural scaling
                                    />
                                    <span>{user.username}</span>
                                </td>
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
