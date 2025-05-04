"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useParams, useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
//import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import FriendRequests from "@/components/FriendRequests";
import "../modal.css"; 
import "../eval.css"; 
import Image from "next/image";
import Board from "@/components/Board";
import "../../gamestate/boardTilesColor.css";





const Eval: React.FC = () => {
    const router = useRouter();
    //const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
    //const [token, setToken] = useState<string | null>(null);
    //const [userId, setUserId] = useState<string | null>(null);
    const apiService = useApi();
    const [friends, setFriends] = useState<Friend[]>([]);
    //const [isPendingRequestsModalOpen, setIsPendingRequestsModalOpen] = useState(false);
    const [immutableBoardTiles, setImmutableBoardTiles] = useState<{ [key:string]: string | null }>({});
    const { id } = useParams();
    const [playerPoints, setPlayerPoints] = useState< {[key:string]: number | null}>({}); // initialize with 0 points each
    const [surrendered, setSurrendered] = useState(false); // Track if the game was surrendered
    
        
    
    
    interface Game {
        id: number;
        users: User[];
        host: User;
        gameStatus: string; // CREATED, ONGOING, TERMINATED
        board: string[][]; // 2D array representing the board
        playerScores: { [key: string]: number }; // Points for each user
    }

    interface User {
        token: string;
        id: number;
        username: string;
        friends: string[];
    }

    interface Friend {
    username: string;
    }

    interface SentInvitation {
        gameId: number;
        targetUsername: string;
    }

    //? I removed polling of friends as we don't use it here jet

    const dictifyMatrix = (matrix: string[][]) => {
        const dict: { [key: string]: string | null } = {};
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] !== "") {
                    const key = `${col}-${row}`;
                    dict[key] = `/letters/${matrix[row][col]} Tile 70.jpg`;
                }
            }
        }
        return dict;
    }

    useEffect(()=> {
        setUsername(localStorage.getItem("username"));
        //setToken(localStorage.getItem("token"));
        //setUserId(localStorage.getItem("userId"));
        apiService.get<Game>(`/games/${id}`)
            .then((game) => {
                console.log("Game data:", game);
                setPlayerPoints((prev) => ({
                    ...prev,
                    ...game.playerScores, 
                }));
                setOpponentUsername(game.users[1].username);
                setImmutableBoardTiles(dictifyMatrix(game.board));
                setSurrendered(game.gameStatus === "TERMINATED" && game.users.length > 1); // Check if the game was surrendered
            })
            .catch((error) => console.error("Error retrieving game information:", error));
    }, []);

    const handleFriendAdded = (friend: User) => {
        setFriends([...friends, friend]);
    };

    const handleButtonClick = () => {
        router.push("/dashboard");
    };

    const handleRematch = async () => {
        try {
            const response = await apiService.post<Game>(
                "/games",
                {}
            );
        
            if (response.id) {
                handleInvite(response.id); // Call the handleInvite function with the new game ID
                router.push(`/lobby/${response.id}`);
            }
            
        } catch (error) {
            console.error("Error creating lobby:", error);
            alert(`Could not create lobby: ${(error as Error).message}`);
        }
    };

    const handleInvite = (id: number) => {    
        apiService.post<SentInvitation>(
            "/games/invitations",
            {
                gameId: id, // Use the game ID from the URL
                targetUsername: opponentUsername, // The username entered in the modal
            }
          )
            .catch((error) => {
                console.error("Error sending game invitation:", error);
                alert("Failed to send the invitation. Please try again.");
            });
    };
    
    return (
    <div>
      <header>
        <button 
            className="nav_button"
            onClick={handleButtonClick}
            style={{ backgroundColor: '#D04949', left: 0, marginLeft: '1vw' }}
        >
            Dashboard
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
        <div id = "left_side">
            <div id = "end_reason_container">
                <span id = "end_reason">The game ended with {surrendered ? "somebody" : "nobody"} surrendering.</span>
            </div>
            <div className = "user_quarter">
                <div className = "place" id = "first_place">
                    1st
                </div>
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
                        Stand In 
                    </div>
                </div>
                <div className = "userInfo">
                    <span>Score:</span>
                    <span className = "points">{playerPoints[0]}</span>
                </div>
            </div>
            <div className = "user_quarter">
            <div className = "place" id = "second_place">
                    2nd
                </div>
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
                        Stand In 
                    </div>
                </div>
                <div className = "userInfo">
                    <span>Score:</span>
                    <span className = "points">{playerPoints[1]}</span>
                </div>
            </div>
        </div>
        <div id = "right_side">
            <div id="board_container">
                <Board
                    boardTiles={immutableBoardTiles}
                    immutableBoardTiles={immutableBoardTiles}
                    isInteractive={false} // Disable interactivity
                />
            </div>
            <div id = "button_container">
                <div id = "rematch" className="nav_button" onClick={() => handleRematch()}>
                    Rematch
                </div>
            </div>
        </div>
      </main>
    </div>
    )
  }

export default Eval;
