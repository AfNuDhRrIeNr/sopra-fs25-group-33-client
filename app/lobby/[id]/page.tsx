"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useParams, useRouter } from "next/navigation"; // use NextJS router for navigation
import { Button, Input, Modal } from "antd";
import React, { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
//import { useRouter } from "next/navigation";
import Image from "next/image";
import "../lobby.css";
import { useApi } from "@/hooks/useApi";

// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

const Login: React.FC = () => {
  const games = 0;
  const rank = 0;
  const router = useRouter();
  const [isAlone, setIsAlone] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlayerUsername, setnewPlayerUsername] = useState("");
  const [sentInvitations, setSentInvitations] = useState<SentInvitation[]>([]);
  
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { id } = useParams();
  const apiService = useApi();
  
  interface GameInvitation {
    gameId: number;
    status: string; // "PENDING", "ACCEPTED", "DECLINED"
    senderUsername: string;
  }

  interface SentInvitation {
    gameId: number;
    targetUsername: string;
}

  useEffect(()=> {
      setUsername(localStorage.getItem("username"));
      setToken(localStorage.getItem("token"));
      setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    if (!token || sentInvitations.length === 0) return; // Skip polling if no token or no invitations
    // TODO: Poll the server for the status of the game invitation
    const pollInvitationStatus = () => {
        apiService.get<GameInvitation[]>(`/games/invitations/${userId}`)
            .then((data) => {
              const lastinvitation = data[0];
                if (lastinvitation.status === "DECLINED") {
                    alert("Your game invitation was declined. Redirecting to the dashboard...");
                    router.push("/dashboard"); // Redirect to the dashboard
                }
            })
            .catch((error) => console.error("Error polling game invitation status:", error));
    };

    const intervalId = setInterval(pollInvitationStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [token, sentInvitations, apiService, router]);

  // const [form] = Form.useForm();
  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:
  const handleButtonClick = () => {
    router.push("/dashboard");
  };

  const handleIconClick = () => {
    alert("Icon clicked!");
  };

  /* opens the Modal*/
  const openEditModal = () => {
    setIsModalVisible(true);
  }

  const startGame = () => {
    router.push(`/gamestate/${id}`)
  }

  const handleInvite = () => {
    if (!newPlayerUsername.trim()) {
        alert("Please enter a valid username.");
        return;
    }

    if (!token) {
        alert("You are not authorized. Please log in.");
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
            alert(`Invitation sent to ${newPlayerUsername.trim()}!`);
            setIsModalVisible(false); // Close the modal
            setnewPlayerUsername(""); // Clear the input field
            setSentInvitations((prev) => [...prev, data]); // Update the state with the new invitation
            setIsAlone(false); // Update the UI to reflect that the user is no longer alone
        })
        .catch((error) => {
            console.error("Error sending game invitation:", error);
            alert("Failed to send the invitation. Please try again.");
        });
};


return (
    <div>

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
          onClick={handleIconClick}
          style = {{cursor: "pointer"}}
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
        <button className = "nav_button" 
        id = "invitePlayer"
        onClick = {isAlone ? openEditModal : startGame}
        style = {{background: "#4AAC55"}}>
          {isAlone ? "Invite Player" : "Start Game"}
        </button>
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
      <Modal
      title = {`Send lobby invite`}
      open = {isModalVisible}
      onCancel = {() => setIsModalVisible(false)}
      footer = {[
        <Button key = "cancel" onClick = {() => setIsModalVisible(false)}>
          Cancel
        </Button>,
        <Button key = "Send" type="primary" onClick = {handleInvite}>
          Send
        </Button>
      ]}
      >
        <Input
        type="string"
        value = {newPlayerUsername}
        onChange = {(e) => setnewPlayerUsername(e.target.value)}
        placeholder="Enter username"
        >
        </Input>
      </Modal>
    </main>

  </div>
  )
}

export default Login;
