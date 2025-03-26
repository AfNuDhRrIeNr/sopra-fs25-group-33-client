"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { Button, Input, Modal } from "antd";
import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
//import { useRouter } from "next/navigation";
import Image from "next/image";
import "./gamestate.css";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

const Gamestate: React.FC = () => {



return (
    <div id = "screen">
        <div id = "board-container">
            <div id = "game-board">

            </div>
        </div>
        <div id = "rest-container">
            <div id = "top">

            </div>
            <div id = "bag">

            </div>
            <div id = "game-buttons">

            </div>
        </div>
    </div>
  )
}

export default Gamestate;
