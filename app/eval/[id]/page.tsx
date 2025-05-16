"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useParams, useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
import { useApi } from "@/hooks/useApi";
import FriendRequests from "@/components/FriendRequests";
import "../eval.css"; 
import Image from "next/image";
import Board from "@/components/Board";
import "../../gamestate/boardTilesColor.css";
import useAuth from "@/hooks/useAuth";
import LoadingCubes from "@/components/loadingCubes";
import { CustomAlertModal } from "@/components/customModal";



const defaultUser: User = {
    token: "",
    id: 0,
    username: "Unknown",
    status: "",
    highScore: 0,
    friends: [],
}

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

const Eval: React.FC = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setuserId] = useState<string | null>(null);
    const { isAuthenticated, isFetching } = useAuth();
    const apiService = useApi();
    const [immutableBoardTiles, setImmutableBoardTiles] = useState<{ [key:string]: string | null }>({});
    const { id } = useParams();
    const [playerPoints, setPlayerPoints] = useState< {[key:string]: number | null}>({}); // initialize with 0 points each
    const [surrendered, setSurrendered] = useState(false); // Track if the game was surrendered
    const [winner, setWinner] = useState<User>(defaultUser);
    const [loser, setLoser] = useState<User>(defaultUser);
    const [isLoading, setIsLoading] = useState(false);

    
    

    //? Removed polling of friends as we don't use it here jet

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

        setuserId(localStorage.getItem("userId"));
    }, []);

    useEffect(() => {
        apiService.get<Game>(`/games/${id}`)
            .then((game) => {
                console.log("Game data:", game);
                setPlayerPoints((prev) => {
                    const updated = { ...prev, ...game.playerScores };
                    // Ensure both users have a score entry
                    if (Object.keys(updated).length < 2) {
                        game.users.forEach(user => {
                            if (!(user.id in updated)) {
                                updated[user.id] = 0;
                            }
                        });
                    }
                    return updated;
                });
                setWinner(game.users[0]);
                setLoser(game.users[1]);
                setImmutableBoardTiles(dictifyMatrix(game.board));
                if (localStorage.getItem("SurrenderedId")!="0") {
                    setSurrendered(true); // Check if the game was surrendered
                    if (game.users[0].id.toString() == localStorage.getItem("SurrenderedId")) {
                        setWinner(game.users[1]);
                        setLoser(game.users[0]);
                    } else {
                        setWinner(game.users[0]);
                        setLoser(game.users[1]);
                    }
                } else {
                    if (
                        playerPoints[game.users[0].id] !== null && playerPoints[game.users[0].id] !== undefined &&
                        playerPoints[game.users[1].id] !== null && playerPoints[game.users[1].id] !== undefined
                        ) {
                            if (playerPoints[game.users[0].id]! > playerPoints[game.users[1].id]!) {
                                setWinner(game.users[0]);
                                setLoser(game.users[1]);
                            } else {
                                setWinner(game.users[1]);
                                setLoser(game.users[0]);
                            }
                        }
                }
            })
            .catch((error) => console.error("Error retrieving game information:", error));
    }, []);

    const handleDashboardNavigation = () => {
        setIsLoading(true);
        apiService.put(`/users?userId=${userId}`, {
            status: "ONLINE"
        })
        .then(() => {
            router.push("/dashboard");
        })
        .catch((error) => {
            console.error("Error updating user status:", error);
            alert("Failed to update user status. Please try again.");
        });
    };

    const handleRematch = async () => {
        setIsLoading(true);
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
                gameId: id, 
                targetUsername: localStorage.getItem("username") == winner.username 
                ? loser.username 
                : winner.username,
            }
          )
            .catch((error) => {
                console.error("Error sending game invitation:", error);
                alert("Failed to send the invitation. Please try again.");
            });
    };
    
    if (isFetching) {
        return <div>Fetching...</div>;
    }

    if (!isAuthenticated) {
        return <>
            <CustomAlertModal
                    visible={true}
                    title={"Account needed"}
                    message={"An account is needed to visit this page. Please log in or register to continue."}
                    onClose={() => router.push("/")}
            />
        </>
    }

    return (
    <div className="eval-page">
      <header>
        <button 
            className="nav_button"
            onClick={handleDashboardNavigation}
            style={{ backgroundColor: '#D04949', left: 0, marginLeft: '1vw' }}
        >
            Dashboard
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
                        {winner.username} 
                    </div>
                </div>
                <div className = "userInfo">
                    <span>Score:</span>
                    <span className = "points">{playerPoints[winner.id]}</span>
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
                        {loser.username} 
                    </div>
                </div>
                <div className = "userInfo">
                    <span>Score:</span>
                    <span className = "points">{playerPoints[loser.id]}</span>
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
