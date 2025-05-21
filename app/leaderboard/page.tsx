"use client";
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import "./leaderboard.css";
import Image from "next/image";
import FriendRequests from "@/components/FriendRequests";
import useAuth from "@/hooks/useAuth";
import LoadingCubes from "@/components/loadingCubes";
import { CustomAlertModal } from "@/components/customModal";

interface User {
  token: string;
  id: number;
  username: string;
  status: string; // ONLINE, OFFLINE, IN_GAME
  highScore: number;
  friends: Friend[];
}

interface Friend {
  username: string;
  status: string; // ONLINE, OFFLINE, IN_GAME
}

const LeaderboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const apiService = useApi();
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { isAuthenticated, isFetching } = useAuth();
  const maxLeaderboardSize = 20;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setUserId(localStorage.getItem("userId"));
  }, []);

  const handleButtonClick = () => {
    setIsLoading(true);
    router.push("/dashboard");
  };

  useEffect(() => {
    apiService.get<User[]>("/users?leaderboard=true")
      .then((data) => setUsers(data))
      .catch((error) =>
        console.error("Error fetching leaderboard data:", error)
      );

    apiService.get<User[]>(`/users?userId=${localStorage.getItem("userId")}`)
      .then((data) => {
        const user = (data[0] || {}) as User;
        const friendsList = (user.friends || []).map((friend) => ({
          username: friend.username,
          status: friend.status,
        }));
        setFriends(friendsList);
      })
      .catch((error) => console.error("Error fetching friends:", error));
  }, [apiService, userId]);

  const friendsLeaderboard = users
    .filter((user) =>
      friends.some((friend) => friend.username === user.username) ||
      user.username === username
    )
    .slice(0, maxLeaderboardSize);

  const globalLeaderboard = users.slice(0, maxLeaderboardSize);

  const renderLeaderboardTable = (leaderboard: User[]) => (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>User Info</th>
          <th>Highscore</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((user, index) => (
          <tr key={index}>
            <td className="user-info">
              <Image
                src={index === 0
                  ? "/Gold.png"
                  : index === 1
                  ? "/Silver.png"
                  : index === 2
                  ? "/Bronze.png"
                  : "/User_Icon.jpg"}
                alt={index === 0
                  ? "Gold Medal"
                  : index === 1
                  ? "Silver Medal"
                  : index === 2
                  ? "Bronze Medal"
                  : "User Icon"}
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
  );

  if (isFetching) {
    return <div>Fetching...</div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <CustomAlertModal
          visible={true}
          title={"Account needed"}
          message={"An account is needed to visit this page. Please log in or register to continue."}
          onClose={() => router.push("/")}
        />
      </>
    );
  }

  return (
    <div className="leaderboard-page">
      <header>
        <button
          className="nav_button"
          onClick={handleButtonClick}
          style={{ backgroundColor: "#D04949", left: 0, marginLeft: "1vw" }}
        >
          Back
        </button>
        <div className="Title">ScrabbleNow</div>
        <div className="userSnippet">
          <span className="username">{username}</span>
          <FriendRequests />
        </div>
      </header>
      <div className="leaderboard-container">
        {isLoading && (
          <div className="loading-cubes-overlay">
            <LoadingCubes message="Loading..." />
          </div>
        )}
        <div className="leaderboard-section">
          <h2>Friends Leaderboard</h2>
          {renderLeaderboardTable(friendsLeaderboard)}
        </div>
        <div className="leaderboard-section">
          <h2>Global Leaderboard (Top {maxLeaderboardSize})</h2>
          {renderLeaderboardTable(globalLeaderboard)}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
