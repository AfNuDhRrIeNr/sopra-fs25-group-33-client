"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { Button, Input, Modal } from "antd";
import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
//import { useRouter } from "next/navigation";
import Image from "next/image";
import "./lobby.css";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

const Login: React.FC = () => {
  const games = 0;
  const rank = 0;
  const router = useRouter();
  const [isAlone, setIsAlone] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editValue, setEditValue] = useState("");
  // const apiService = useApi();
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
    alert("Game was started!");
  }

  const handleInvite = () => {
    alert(`Invite to ${editValue} was sent!`);
    setIsAlone(false);
    setIsModalVisible(false);
  }


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
          {"Guest"/* {username || "Guest"} */}
        </span>

        <Image
          className = "icon"
          src="/images/User_Icon.jpg"
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
            src="/images/User_Icon.jpg"
            alt="User Icon"
            width={100}
            height={100}
            priority
          />
          <div>
            {"Guest"}
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
            src="/images/User_Icon.jpg"
            alt="User Icon"
            width={100}
            height={100}
            priority
          />
          <div>
            {isAlone ? "?" : "Guest"}
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
              src="/images/Board.jpg"
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
        value = {editValue}
        onChange = {(e) => setEditValue(e.target.value)}
        placeholder="Enter username"
        >
        </Input>
      </Modal>
    </main>

  </div>
  )
}

export default Login;
