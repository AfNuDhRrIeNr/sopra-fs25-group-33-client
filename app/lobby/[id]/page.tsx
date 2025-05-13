"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useParams, useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
import Image from "next/image";
import "../lobby.css";
import { useApi } from "@/hooks/useApi";
import { CustomInputModal } from "@/components/customModal";
import FriendRequests from "@/components/FriendRequests";

const Lobby: React.FC = () => {
  const games = 0;
  const rank = 0;
  const router = useRouter();
  const [isAlone, setIsAlone] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlayerUsername, setnewPlayerUsername] = useState("");
  const [sentInvitations, setSentInvitations] = useState<SentInvitation[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const { id } = useParams();
  const apiService = useApi();
  
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

  useEffect(()=> {
      setUsername(localStorage.getItem("username"));
      setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!token) return;

    const pollGame = () => {
        apiService.get<Game>(`/games/${id}`)
            .then((game) => {
                const guest = game.users.length > 1 ? game.users.find((user) => user.token !== token) : null;
                if (guest) {
                    // User is in the game, update state accordingly
                    setIsAlone(false);
                    setnewPlayerUsername(guest.username);
                }
                if (!isHost) {
                setIsHost(game.host.token === token); // Check if the current user is the host
                }
                if (game.gameStatus === "ONGOING") {
                  router.push(`/gamestate/${id}`); // Redirect if the game has started
                }
            })
            .catch((error) => console.error("Error polling game status:", error));
    };
    
    const intervalId = setInterval(pollGame, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [token, sentInvitations, apiService, router, id]);

  const handleButtonClick = () => {
    router.push("/dashboard");
  };

  /* opens the Modal*/
  const openEditModal = () => {
    setIsModalVisible(true);
  }

  const startGame = () => {
    // PUT /games/{id}
    apiService.put<Game>(`/games/${id}`, {
      gameStatus: "ONGOING",
    })
      .then((data) => {
        console.log("Game started successfully:", data);
        router.push(`/gamestate/${id}`);
      })
      .catch((error) => {
        console.error("Error starting game:", error);
        alert("Failed to start the game. Please try again.");
      });
  }

  const handleInvite = () => {
    if (!newPlayerUsername.trim()) {
        alert("Please enter a valid username.");
        return;
    }
    else if (newPlayerUsername.trim() === username) {
        alert("You cannot invite yourself.");
        return;
    }

    apiService.post<SentInvitation>(
        "/games/invitations",
        {
            gameId: id, // Use the game ID from the URL
            targetUsername: newPlayerUsername.trim(), // The username entered in the modal
        }
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
// this is where the page is updated when a friend is added, not needed on some pages
  const handleFriendAdded = (friend: User) => {
    setFriends([...friends, friend]); // Update friends list
  };

return (
    <div>

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

    <main>
      {/* <div id = "alignmentGuide"></div> */}
      <div id= "users_border">
        <div className = "user" style={{marginLeft: "8.1%"}}>
          <Image
            className = "bigger_icon"
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
        <div className = "userInfo" style = {{marginLeft: "-1.5vw"}}>
          <span>Rank: <span>{rank}</span></span>

          <span>Games: <span>{games}</span></span>
        </div>

        <div className = "userInfo" style = {{marginLeft: "18vw", opacity: isAlone ? 0 : 1}}>
          <span><span>{rank}</span>:Rank</span>
        
          <span><span>{games}</span>:Games</span>
        </div>
        <div className = "user" style={{opacity: isAlone ? 0.5 : 1, marginLeft:"-1.5vw", marginRight: "8.1%"}}>
          <Image
            className = "bigger_icon"
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
      <div id = "lowerScreen">
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
        <div id= "settings">          
          <span>Game Information:</span>
          <span>Players: <span>2</span></span>
          <span>Time: <span>45</span></span>
          <span>Board: <span>classic</span></span>
        </div>
        <div id= "boardImage">
          <Image
              className = "board"
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
      onCancel={() => setIsModalVisible(false)}
      inputValue={newPlayerUsername}
      onInputChange={(e) => setnewPlayerUsername(e.target.value)}
      />
    </main>

  </div>
  )
}

export default Lobby;
