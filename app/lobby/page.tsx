"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
//import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/page.module.css";
import "./lobby.css";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";


interface FormFieldProps {
  label: string;
  value: string;
}

const Login: React.FC = () => {
  const games = 0;
  const rank = 0;
  const router = useRouter();
  const [isAlone, setIsAlone] = useState(false);
  // const apiService = useApi();
  // const [form] = Form.useForm();
  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:
  const handleButtonClick = () => {
    router.push("/Dashboard");
  };

  const handleIconClick = () => {
    alert("Icon clicked!");
  };

  const handleInvite = () => {
    alert("Invite clicked!")
  }

  const startGame = () => {
    alert("Game was started!")
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
        onClick = {isAlone ? handleInvite : startGame} 
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

    </main>

  </div>
  )
}

export default Login;

// export default function Home() {
  //   return (
    //     <div className={styles.page}>
    //       <h1 className={styles.header}>ScrabbleNow is in progress</h1>
    //       <main className={styles.main}>
    //         <Image
    //           className={styles.logo}
    //           src="/next.svg"
    //           alt="Next.js logo"
    //           width={180}
    //           height={38}
    //           priority
    //         />
    //       </main>
    //     </div>
    //     );
    //   }


    // const {
    //   // value: token, // is commented out because we do not need the token value
    //   set: setToken, // we need this method to set the value of the token to the one we receive from the POST request to the backend server API
    //   // clear: clearToken, // is commented out because we do not need to clear the token when logging in
    // } = useLocalStorage<string>("token", ""); // note that the key we are selecting is "token" and the default value we are setting is an empty string
    // // if you want to pick a different token, i.e "usertoken", the line above would look as follows: } = useLocalStorage<string>("usertoken", "");
    
    // const handleLogin = async (values: FormFieldProps) => {
    //   try {
    //     // Call the API service and let it handle JSON serialization and error handling
    //     const response = await apiService.post<User>("/users", values);
    
    //     // Use the useLocalStorage hook that returned a setter function (setToken in line 41) to store the token if available
    //     if (response.token) {
    //       setToken(response.token);
    //     }
    
    //     // Navigate to the user overview
    //     router.push("/users");
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       alert(`Something went wrong during the login:\n${error.message}`);
    //     } else {
    //       console.error("An unknown error occurred during login.");
    //     }
    //   }