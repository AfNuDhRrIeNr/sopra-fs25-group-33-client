"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useParams, useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useEffect, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import Image from "next/image";
import "../lobby.css";
import { useApi } from "@/hooks/useApi";
import { CustomInputModal } from "@/components/customModal";
import FriendRequests from "@/components/FriendRequests";
import useAuth from "@/hooks/useAuth";
import LoadingCubes from "@/components/loadingCubes";
import { CustomAlertModal } from "@/components/customModal";

const Lobby: React.FC = () => {
  const router = useRouter();
  const [isAlone, setIsAlone] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlayerUsername, setnewPlayerUsername] = useState("");
  const [sentInvitations, setSentInvitations] = useState<SentInvitation[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { isAuthenticated, isFetching } = useAuth();
  const [isHost, setIsHost] = useState(false);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const { id } = useParams();
  const apiService = useApi();
  const [isLoading, setIsLoading] = useState(false);

  interface Game {
    gameId: number;
    users: User[];
    host: User;
    gameStatus: string; // CREATED, ONGOING, TERMINATED
  }

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

  interface SentInvitation {
    gameId: number;
    targetUsername: string;
  }

  useEffect(() => {
    // Fetch leaderboard for rank
    apiService.get<User[]>(`/users?leaderboard=true`)
      .then((users) => {
        setLeaderboard(users);
        if (username) {
          const userIndex = users.findIndex((u) => u.username === username);
          if (userIndex !== -1) {
            setRank(userIndex + 1);
          }
        }
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, [token, username, apiService]);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const pollGame = () => {
      apiService.get<Game>(`/games/${id}`)
        .then((game) => {
          console.log("Game data:", game);
          const guest = game.users.length > 1
            ? game.users.find((user) => user.token !== token)
            : null;
          if (guest) {
            setIsAlone(false);
            setnewPlayerUsername(guest.username);
          } else {
            setIsAlone(true);
            if (!isModalVisible) {
              setnewPlayerUsername("");
            }
          }
          if (!isHost) {
            setIsHost(game.host.token === token);
          }
          // Set highscore for current user
          if (username) {
            const me = game.users.find((u) => u.username === username);
            if (me) setHighScore(me.highScore);
          }
          if (game.gameStatus === "ONGOING") {
            router.push(`/gamestate/${id}`);
          }
        })
        .catch((error) => console.error("Error polling game status:", error));
    };

    const intervalId = setInterval(pollGame, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [token, sentInvitations, apiService, router, id, isModalVisible]);

  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      await apiService.put(
        `/games/${id}/users/${localStorage.getItem("userId")}/leave`,
        {},
      );
      router.push("/dashboard");
    } catch (error) {
      setIsLoading(false);
      console.error("Error leaving game:", error);
      alert("Failed to leave the game. Please try again.");
    }
  };

  /* opens the Modal*/
  const openEditModal = () => {
    setIsModalVisible(true);
  };

  const startGame = () => {
    setIsLoading(true);
    // PUT /games/{id}
    apiService.put<Game>(`/games/${id}`, {
      gameStatus: "ONGOING",
    })
      .then((data) => {
        console.log("Game started successfully:", data);
        router.push(`/gamestate/${id}`);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error starting game:", error);
        alert("Failed to start the game. Please try again.");
      });
  };

  const handleInvite = () => {
    if (!newPlayerUsername.trim()) {
      alert("Please enter a valid username.");
      return;
    } else if (newPlayerUsername.trim() === username) {
      alert("You cannot invite yourself.");
      return;
    }

    apiService.post<SentInvitation>(
      "/games/invitations",
      {
        gameId: id, // Use the game ID from the URL
        targetUsername: newPlayerUsername.trim(), // The username entered in the modal
      },
    )
      .then((data) => {
        setIsModalVisible(false); // Close the modal
        setSentInvitations((prev) => [...prev, data]); // Update the state with the new invitation
      })
      .catch((error) => {
        console.error("Error sending game invitation:", error);
        alert("Failed to send the invitation. Please try again.");
      });
  };

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
    <div>
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

      <main>
        {isLoading && (
          <div className="loading-cubes-overlay">
            <LoadingCubes message="Loading..." />
          </div>
        )}
        <div id="users_border">
          <div className="user" style={{ marginLeft: "8.1%" }}>
            <Image
              className="bigger_icon"
              src="/User_Icon.jpg"
              alt="User Icon"
              width={100}
              height={100}
              priority
            />
            <div>
              {username}
            </div>
          </div>
          <div className="userInfo" style={{ marginLeft: "-1.5vw" }}>
            <span>
              <b>Rank:</b> <span>{rank !== null ? rank : "-"}</span>
            </span>
            <span>
              <b>Highscore:</b>{" "}
              <span>{highScore !== null ? highScore : "-"}</span>
            </span>
          </div>

          <div
            className="userInfo"
            style={{ marginLeft: "18vw", opacity: isAlone ? 0 : 1 }}
          >
            <span>
              <b>Rank:</b>{" "}
              <span>
                {!isAlone && newPlayerUsername && leaderboard.length > 0
                  ? (() => {
                    const idx = leaderboard.findIndex((u) =>
                      u.username === newPlayerUsername
                    );
                    return idx !== -1 ? idx + 1 : "-";
                  })()
                  : "-"}
              </span>
            </span>
            <span>
              <b>Highscore:</b>{" "}
              <span>
                {!isAlone && newPlayerUsername && leaderboard.length > 0
                  ? (() => {
                    const user = leaderboard.find((u) =>
                      u.username === newPlayerUsername
                    );
                    return user ? user.highScore : "-";
                  })()
                  : "-"}
              </span>
            </span>
          </div>
          <div
            className="user"
            style={{
              opacity: isAlone ? 0.5 : 1,
              marginLeft: "-1.5vw",
              marginRight: "8.1%",
            }}
          >
            <Image
              className="bigger_icon"
              src="/User_Icon.jpg"
              alt="User Icon"
              width={100}
              height={100}
              priority
            />
            <div>
              {isAlone ? "?" : newPlayerUsername}
            </div>
          </div>
        </div>
        <div id="lowerScreen">
          {(isAlone || isHost) && (
            <button
              className="nav_button"
              id="invitePlayer"
              onClick={isAlone ? openEditModal : startGame}
              style={{ background: "#4AAC55" }}
            >
              {isAlone ? "Invite Player" : "Start Game"}
            </button>
          )}
          <div id="settings">
            <span>
              <b>Game Information</b>
            </span>
            <span>
              Players<span>2</span>
            </span>
            <span>
              Time<span>45</span>
            </span>
            <span>
              Board<span>classic</span>
            </span>
          </div>
          <div id="boardImage">
            <Image
              className="board"
              src="/Board.jpg"
              alt="Board Image"
              width={330}
              height={330}
              priority
            />
          </div>
        </div>
        <CustomInputModal
          visible={isModalVisible}
          title="Send Game Invitation"
          placeholder="Enter username"
          onSubmit={handleInvite}
          onCancel={() => {
            setIsModalVisible(false);
            setnewPlayerUsername("");
          }}
          inputValue={newPlayerUsername}
          onInputChange={(e) => setnewPlayerUsername(e.target.value)}
        />
      </main>
    </div>
  );
};

export default Lobby;
