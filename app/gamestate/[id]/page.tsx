"use client"; // Required for using React hooks in Next.js

import { useParams, useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useState, useEffect, useRef } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Button } from "antd"; 
import Image from "next/image";
import "../gamestate.css";
import { useApi } from "@/hooks/useApi";
import { Client } from "@stomp/stompjs";
import "../bag.css";
import "../board.css";
import "../boardTilesColor.css";
import SockJS from "sockjs-client";
import "../playerHand.css";
import "../playingButtons.css";
import "../top.css";
import { CustomAlertModal, CustomDecisionModal } from "@/components/customModal"; // Import CustomAlertModal
import { getApiDomain } from "@/utils/domain";
import Board from "@/components/Board";
//import useAuth from "@/hooks/useAuth";


interface GameState {
    id: string;
    board: string[][];
    token: string;
    userTiles: string[];
    action: string;
    playerId: string;
}

interface Game {
    gameId: number;
    users: User[];
    status: string; // CREATED, ONGOING, TERMINATED
    hostTurn: boolean;
    host: User;
    playerPoints: { [userId: string]: number }; // Dictionary with user IDs as keys and points as values
}

interface User {
    token: string;
    id: number;
    username: string;
}

const defaultUser: User = {
    token: "",
    id: 0,
    username: "Unknown",
}

interface GamePutDTO {
    gameStatus: string | null;
    newTiles: string[];
}

const Gamestate: React.FC = () => {
    const router = useRouter();
    const [letter, setLetter] = useState("");
    const [number, setNumber] = useState<number | null>(null);
    const apiService = useApi();
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    // const { isAuthenticated, isLoading } = useAuth();
    const [tilesInHand, setTilesInHand] = useState <(string | null)[]>(new Array(7).fill(null));
    const [selectedTiles, setSelectedTiles ] = useState<number[]>([]);
    const [boardTiles, setBoardTiles] = useState<{ [key:string]: string | null }>({});
    const [immutableBoardTiles, setImmutableBoardTiles] = useState<{ [key:string]: string | null }>({});
    const [isUserTurn, setUserTurn] = useState(true);
    const [playerAtTurn, setPlayerAtTurn] = useState<User>(defaultUser);
    const [isTileOnBoard, setTileOnBoard] = useState(false);
    const [isMoveVerified, setMoveVerified] = useState(false);
    const [isTileSelected, setTileSelected] = useState(false);
    const { id } = useParams();
    const stompClientRef = useRef<Client | null>(null);
    const [remainingTime, setRemainingTime] = useState(45 * 60); // 45 minutes in seconds
    const [alertModalVisible, setAlertModalVisible] = useState(false);
    const [alertModalTitle, setAlertModalTitle] = useState("");
    const [alertModalMessage, setAlertModalMessage] = useState("");
    const [decisionModalVisible, setDecisionModalVisible] = useState(false);
    const [decisionModalTitle, setDecisionModalTitle] = useState("");
    const [decisionModalMessage, setDecisionModalMessage] = useState("");
    const URL = getApiDomain();
    const [playerPoints, setPlayerPoints] = useState< {[key:string]: number | null}>({}); // initialize with 0 points each
    const [gameHost, setGameHost] = useState<User>(defaultUser);
    const [gameGuest, setGameGuest] = useState<User>(defaultUser);
    const [isInitialized, setIsInitialized] = useState(false);
    const tilesInHandRef = useRef(tilesInHand); // Create a ref to store the tiles in hand
    const boardTilesRef = useRef(boardTiles); // Create a ref to store the board tiles
    const immutableBoardTilesRef = useRef(immutableBoardTiles); // Create a ref to store the immutable board tiles
    const [showNumber, setShowNumber] = useState(false); // Toggle between button and number
    const [turnTimeLeft, setTurnTimeLeft] = useState(180);
    const alreadySkippedRef = useRef(false);
    const [lastVoteTime, setLastVoteTime] = useState<number | null>(null); // Store the last vote time
    const [voteCooldownRemaining, setVoteCooldownRemaining] = useState<number | null>(null); // Store the vote cooldown time

    useEffect(()=> {
            setUserId(localStorage.getItem("userId"));
            setToken(localStorage.getItem("token"));
        }, []);

    useEffect(()=> {
        //if (!token) return;
        assignTilesToPlayer(7);
        
        apiService.get<Game>(`/games/${id}`)
            .then((game) => {
                setGameHost(game.host);
                setGameGuest(game.users[1]);

                setPlayerPoints({
                    [game.host.id]: 0,
                    [game.users[1].id]: 0,
                });

                setPlayerAtTurn(game.host);
                setIsInitialized(true); // Set initialized to true after fetching game data
            })
            .catch((error) => console.error("Error retrieving game information:", error));
    }, [id]); 

    
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
    
    useEffect(() => {
        if (!isInitialized) return;
        //if (!isInitialized || !token) return; // Wait until the game data is fetched


        const connectWebSocket = () => {
            const socket = new SockJS(URL + "/connections"); // Your WebSocket URL
            const stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                debug: (str) => console.log(str),
            });
            

            stompClient.onConnect = () => {
                console.log("Connected to WebSocket");
                
                stompClient.subscribe(`/topic/game_states/users/${localStorage.getItem("userId")}`, (message) => {
                    
                    // Assuming the backend sends something like { valid: true/false }
                    const response = JSON.parse(message.body);
                    const action = response.gameState.action.toString();
                    const responseStatus = response.messageStatus.toString();
                    
                    //verify
                    if (responseStatus === "VALIDATION_SUCCESS") {
                        showAlertModal("Validation", "Validation successful!");
                        setMoveVerified(true);
                    } 
                    else if (responseStatus === "VALIDATION_ERROR") {
                        showAlertModal("Validation", `Validation failed! Reason: ${response.message.toString().substring(16)}`);
                    } else if (responseStatus === "SUCCESS" && action === "VOTE") {
                        showDecisionModal("Vote", "Your opponent wants to end the game here. Do you agree?");
                    } else if (responseStatus === "SUCCESS" && action === "NO_VOTE") {
                        showAlertModal("Vote", "Your opponent declined ending the game.");
                    }
                    //submit
                    else if (responseStatus === "SUCCESS" && action === "SUBMIT") {
                        const newUserLetters = response.gameState.userTiles
                        const currentHand = tilesInHandRef.current; // Get the current hand
                        
                        
                        let letterIndex = 0; // Track the index of the next letter to use
                        const updatedHand = currentHand.map((tile) => {
                            if ((tile === "" || tile === null) && letterIndex < newUserLetters.length) {
                                const newLetter = newUserLetters[letterIndex]; // Get the letter at the current index
                                letterIndex++; // Increment the index for the next letter
                                return `/letters/${newLetter} Tile 70.jpg`;
                            }
                            return tile; // Keep the existing tile if it's not empty
                        });

                        setTilesInHand(updatedHand);
                        setTileOnBoard(false);
                    } 
                    

                });
                stompClient.subscribe(`/topic/game_states/${id}`, (message) => {
                    
                    const response = JSON.parse(message.body);
                    console.log("Response: ", response);
                    const action = response.gameState.action.toString();
                    const responseStatus = response.messageStatus.toString();
                    const moveById = response.gameState.playerId.toString();
                    const playerUsername = moveById === gameHost.id.toString() ? gameHost.username : gameGuest.username;
                    if (action === "SUBMIT" && responseStatus === "SUCCESS") {
                        if (moveById !== localStorage.getItem("userId")) {
                            handleReturn();
                        }
                        const points = response.message.match(/scored (\d+) points/); // Extract the number of points scored from the message
                        //points = ["scored number points", "number"] ==> points[0] = wanted text
                        const newBoardTiles = response.gameState.board;
                        const parsedBoardTiles = dictifyMatrix(newBoardTiles);
                        if (moveById === localStorage.getItem("userId")) {
                            showAlertModal("Points scored", `You ${points[0]}!`)
                        } else {
                            showAlertModal("Points scored", `${playerUsername} ${points[0]}!`)
                        }
                        setBoardTiles(parsedBoardTiles);
                        setImmutableBoardTiles(prev => ({ ...prev, ...parsedBoardTiles })); 
                        setPlayerAtTurn(prev => prev.id === gameHost.id ? gameGuest : gameHost);
                        setPlayerPoints((prev) => ({
                            ...prev,
                            ...response.gameState.playerScores, 
                        }));
                                                                                                                                    
                    } else if (responseStatus === "SUCCESS" && action === "GAME_END") {
                        console.log("Game has ended. Reason: time out or vote.");
                        showAlertModal("Game Over", "The game has ended!");
                        
                    } else if (action === "SURRENDER" && responseStatus === "SUCCESS") {
                        console.log("Game has ended. Reason: surrender.");
                        showAlertModal("Game Over", moveById !== localStorage.getItem("userId") ? "Your opponent surrendered." : "You have surrendered.")
                        

                    } else if ((action === "SKIP" || action === "EXCHANGE") && responseStatus === "SUCCESS") {
                        if (moveById !== localStorage.getItem("userId")) {
                            showAlertModal("Your turn!", action === "SKIP" ? "Your opponent skipped their turn." : "Your opponent exchanged some tiles.")
                        }
                        setPlayerAtTurn(prev => prev.id === gameHost.id ? gameGuest : gameHost); 
                    } else if (action === "TIMER" && responseStatus === "SUCCESS") {
                        const remainingSeconds = response.gameState.remainingTime;
                        setRemainingTime(remainingSeconds);
                    }
                });

            };
            
            stompClient.activate();
            stompClientRef.current = stompClient;
        };

        // Call the function to connect the WebSocket
        if (gameHost.id && gameGuest.id && playerAtTurn.id && id && tilesInHand) {
            connectWebSocket();
        }
        // Cleanup WebSocket connection when the component unmounts
        return () => {
            if (stompClientRef.current) {
                console.log("Disconnecting from WebSocket.");
                stompClientRef.current.deactivate();
            }
        };
    }, [isInitialized]); // Add dependencies to useEffect

    const sendMessage = (messageBody: string) => {
        if (stompClientRef.current) {
            stompClientRef.current.publish({
                destination: `/ws/game_states/${id}`,
                body: messageBody,
            });
        }

    };

    const showAlertModal = (title: string, message: string) => {
        setAlertModalTitle(title);
        setAlertModalMessage(message);
        setAlertModalVisible(true);
    };

    const showDecisionModal = (title: string, message: string) => {
        setDecisionModalTitle(title);
        setDecisionModalMessage(message);
        setDecisionModalVisible(true);
    };
    
    const handleModalClose = () => {
        setAlertModalVisible(false);
        setDecisionModalVisible(false);
    };

    const handleGameOverClose = () => {
        setAlertModalVisible(false);
        router.push(`/eval/${id}`); // Redirect to the home page or any other page
    }
    
    const handleCheck = async () => {
        if (letter.length !== 1 || !/[a-zA-Z]/.test(letter)) { // ! Never reached since button is disabled
            showAlertModal("Error", "Please enter a single letter.");
            return;
        }
        try 
        {                               
            const response = await apiService.get<number>(`/games/${id}/letters/${letter}`); 
            
            if (response != null) {
                setNumber(response);
                setShowNumber(true); // Show the number after fetching
                setTimeout(() => {
                    setShowNumber(false); // Hide the number after 5 seconds
                }, 5000);
            }
        } catch (error) {
            console.error("Error:", error);
            showAlertModal("Error", `Failed to retrieve letter count: ${(error as Error).message}`);
        }
    };
 
    const constructMatrix = () => {
        // Initialize the 15x15 matrix with null values (or empty string)
        const matrix: (string)[][] = Array.from({ length: 15 }, () => Array(15).fill(""));
        
        // Iterate over the boardTiles and place each tile on the correct matrix position
        Object.entries(boardTiles).forEach(([key, tileImage]) => {
            const [col, row] = key.split('-').map(Number); // Split the key like "7-7" into [7, 7]
            if (tileImage) {
                matrix[row][col] = tileImage[9]; // Place the tile in the correct position in the matrix
            }
        });
    
        return matrix;
    };
    
    const verifyWord = () => {
        const matrix = constructMatrix(); // Get the constructed matrix
        const newTilesArray = tilesInHand.map(tile => tile ? tile[9] : "");
        
        if (!id) {
            console.error("Game ID is null or undefined.");
            return;
        }
        // Create the message body using the GameState interface
        const messageBody: GameState = {
            id: id.toString(),
            board: matrix,
            token: token!,
            userTiles: newTilesArray,
            action: "VALIDATE",
            playerId: localStorage.getItem("userId")!,
        };
    
        // Convert the object to a JSON string before sending
        sendMessage(JSON.stringify(messageBody));
    };
    
    const toggleTileSelection = (index: number) => {
        setSelectedTiles((prevSelected) =>
        prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
    };

    interface ExchangeResponse {
        gameStatus: string | null;
        newTiles: string[];
    }

    const exchangeTiles = async () => {
        const tilesToExchange = selectedTiles.map((i) => tilesInHand[i]);
        const exchangeList = tilesToExchange.map(tile => tile ? tile[9] : "");
        showAlertModal("Exchange", `${exchangeList} were exchanged.`)

        try {
            const response = await apiService.put<ExchangeResponse>(
                `/games/${id}/exchange`,
                exchangeList,
            );
            if (response != null) {
                const newUserLetters = response.newTiles;        
                const newUserHand = newUserLetters.map((letter: string) => `/letters/${letter} Tile 70.jpg`);
                const updatedHand = [...tilesInHand];
                selectedTiles.forEach((index, i) => {
                    if (newUserHand[i])
                        updatedHand[index] = newUserHand[i]; // Set exchanged tiles to null
                });
                setTilesInHand(updatedHand);
                setSelectedTiles([]); // Clear selected tiles after exchange
                setTurnTimeLeft(180); // Reset the timer to 3 minutes
                setUserTurn(false); // Toggle user turn after exchange
            }
        }
        catch (error) {
            console.error("Exchange Error:", error);
            showAlertModal("Error", `Exchange failed: ${(error as Error).message}`);
        }
        if (!id) {
            console.error("Game ID is null or undefined.");
            return;
        }
        // Create the message body using the GameState interface
        const messageBody: GameState = {
            id: id.toString(),
            board: Array(15).fill(Array(15).fill("")),
            token: token!,
            userTiles: Array(7).fill(""),
            action: "EXCHANGE",
            playerId: localStorage.getItem("userId")!,
        };
    
        // Convert the object to a JSON string before sending
        sendMessage(JSON.stringify(messageBody));
    }

    const skipTurn = () => {
        if (!id || alreadySkippedRef.current) {
            console.error("Game ID is null or undefined.");
            return;
        }
        setTurnTimeLeft(180); // Reset the timer to 3 minutes
        alreadySkippedRef.current = true; // Update the ref to indicate the turn has been skipped
        // Create the message body using the GameState interface
        const messageBody: GameState = {
            id: id.toString(),
            board: Array(15).fill(Array(15).fill("")),
            token: token!,
            userTiles: Array(7).fill(""),
            action: "SKIP",
            playerId: localStorage.getItem("userId")!,
        };
    
        // Convert the object to a JSON string before sending
        sendMessage(JSON.stringify(messageBody));
    };

    const handleVote = () => {

        const currentTime = Date.now();

        if (lastVoteTime && currentTime - lastVoteTime < 5 * 60 * 1000) {
            const remainingTime = Math.ceil((5 * 60 * 1000 - (currentTime - lastVoteTime)) / 1000);
            showAlertModal("Error", `You can only vote once every 5 minutes. Please wait ${remainingTime} seconds.`);
            return;
        }
        if (!id || !stompClientRef.current) {
            console.error("Game ID or WebSocket client is null or undefined.");
            return;
        }

        const messageBody: GameState = {
            id: id.toString(),
            board: Array(15).fill(Array(15).fill("")),
            token: token!,
            userTiles: Array(7).fill(""),
            action: "VOTE",
            playerId: localStorage.getItem("userId")!,
        };

        sendMessage(JSON.stringify(messageBody));
        setLastVoteTime(currentTime); // Update the last vote time
        showAlertModal("Vote", "Vote sent! Waiting for your opponent's response.");
    }
    
    const handleDecline = () => {
        if (!id || !stompClientRef.current) {
            console.error("Game ID or WebSocket client is null or undefined.");
            return;
        }

        const messageBody: GameState = {
            id: id.toString(),
            board: Array(15).fill(Array(15).fill("")),
            token: token!,
            userTiles: Array(7).fill(""),
            action: "NO_VOTE",
            playerId: localStorage.getItem("userId")!,
        };

        sendMessage(JSON.stringify(messageBody));
        setDecisionModalVisible(false); // Close the decision modal
        showAlertModal("Vote", "You declined ending the game.");
    }

    const commitWord = () => {
        setMoveVerified(false);
        const matrix = constructMatrix(); // Get the constructed matrix
        const newTilesArray = tilesInHand.map(tile => tile ? tile[9] : "");
        const updatedTilesArray = tilesInHand.map(tile => tile ? tile : "");
        setTilesInHand(updatedTilesArray); // Update the tiles in hand
        setImmutableBoardTiles(prev => ({ ...prev, ...boardTiles })); // Store the current board state
        
        if (!id) {
            console.error("Game ID is null or undefined.");
            return;
        }

        setTurnTimeLeft(180); // Reset the timer to 3 minutes

        // Create the message body using the GameState interface
        const messageBody: GameState = {
            id: id.toString(),
            board: matrix,
            token: token!,
            userTiles: newTilesArray,
            action: "SUBMIT",
            playerId: localStorage.getItem("userId")!,
        };
    
        // Convert the object to a JSON string before sending
        sendMessage(JSON.stringify(messageBody));
    };

    useEffect (() => {
        //if (!token) return;
        tilesInHandRef.current = tilesInHand; // Update the ref whenever tilesInHand changes
    }, [tilesInHand])

    useEffect (() => {
        //if (!token) return;
        boardTilesRef.current = boardTiles; // Update the ref whenever boardTiles changes
    }, [boardTiles]);

    useEffect (() => {
        //if (!token) return;
        immutableBoardTilesRef.current = immutableBoardTiles; // Update the ref whenever immutableBoardTiles changes)
    }, [immutableBoardTiles]);

    const handleSurrender = () => {
        setDecisionModalVisible(false); // Close the decision modal
        if (!id || !stompClientRef.current) {
            console.error("Game ID or WebSocket client is null or undefined.");
            showAlertModal("Error", "Cannot surrender. Game ID or WebSocket connection is missing.");
            return;
        }    
        const messageBody: GameState = {
            id: id.toString(),
            board: Array(15).fill(Array(15).fill("")),
            token: token!,
            userTiles: Array(7).fill(""),
            action: "SURRENDER",
            playerId: localStorage.getItem("userId")!,
        };
        
        sendMessage(JSON.stringify(messageBody));
    };

    const handleGameEnd = () => {
        setDecisionModalVisible(false); // Close the decision modal
        if (!id || !stompClientRef.current) {
            console.error("Game ID or WebSocket client is null or undefined.");
            showAlertModal("Error", "The game cannot be ended since the game cannot be found or the WebSocket client has an error.");
            return;
        }    
        const messageBody: GameState = {
            id: id.toString(),
            board: Array(15).fill(Array(15).fill("")),
            token: token!,
            userTiles: Array(7).fill(""),
            action: "GAME_END",
            playerId: localStorage.getItem("userId")!,
        };

        sendMessage(JSON.stringify(messageBody));
    };

    const handleReturn = () => {
        const updatedHand = [...tilesInHandRef.current];
        const updatedBoard = { ...boardTilesRef.current };
        const tempImmutables = { ...immutableBoardTilesRef.current };
        let hasChanges = false;

        for (const key in boardTilesRef.current) {

            if (tempImmutables[key]) {

                continue; // Skip immutable tiles
            }

            const image = updatedBoard[key];
            const emptyIndex = updatedHand.findIndex(tile => tile === null);
            if (emptyIndex !== -1 && image) {
                updatedHand[emptyIndex] = image;
                delete updatedBoard[key];
                hasChanges = true;
            } else {
                // Optional: alert or handle situation where hand is full
                console.warn(`No space in hand to return tile from board position ${key}`);
            }
        }

        if (hasChanges) {
            setTilesInHand(updatedHand);
            setBoardTiles(updatedBoard);
        } else {
            console.log("No changes made to hand or board.");
        }
    }

    const handleTileClick = (col: number, row: number) => {
        const key = `${col}-${row}`;
        const tileImage = boardTilesRef.current[key];
        if (!tileImage) {
            console.warn(`No tile found at position ${key}`);
            return;
        }
        const emptyIndex = tilesInHandRef.current.findIndex(tile => tile === null);

        if (emptyIndex === -1) {
            console.warn("No empty space in hand to return the tile.");
            return;
        }
        const updatedHand = [...tilesInHandRef.current];
        updatedHand[emptyIndex] = tileImage; // Add the tile to the hand
        const updatedBoard = { ...boardTilesRef.current };
        delete updatedBoard[key]; // Remove the tile from the board
        setTilesInHand(updatedHand);
        setBoardTiles(updatedBoard);
    }

    const handleHandDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData("index", index.toString());
        e.dataTransfer.setData("imageSrc", tilesInHand[index] || "");
    
        const target = e.target as HTMLImageElement;
        target.classList.add("dragging");
    
        // Keep the dragged image visible since reference opacity is now 0
        const dragPreview = document.createElement("img");
        dragPreview.src = target.src;
        dragPreview.style.width = target.width + "px";
        dragPreview.style.height = target.height + "px";
    
        e.dataTransfer.setDragImage(dragPreview, target.width / 2, target.height / 2);
    };

      // Handle drag start
    const handleDragStart = (e: React.DragEvent, col: number, row: number) => {
        e.dataTransfer.setData("col", col.toString());
        e.dataTransfer.setData("row", row.toString());
        e.dataTransfer.setData("imageSrc", boardTiles[`${col}-${row}`] || '');
        
        const target = e.target as HTMLImageElement; //set original e (e meaning event) (e.target) type as htmlimage
        target.classList.add('dragging');
        
        //keep the dragged Image visible since reference opacity is now 0
        const dragPreview = document.createElement("img");
        dragPreview.src = target.src;
        dragPreview.style.width = target.width + "px";
        dragPreview.style.height = target.height + "px";

        e.dataTransfer.setDragImage(dragPreview, target.width/2, target.height/2);
    };

    // Handle drop
    const handleHandDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault(); //prevent default dropping logic and apply custom logic
        //get stored info of the image
        const draggedIndex = e.dataTransfer.getData("index");
        const draggedImage = e.dataTransfer.getData("imageSrc");
        const draggedCol = parseInt(e.dataTransfer.getData("col"));
        const draggedRow = parseInt(e.dataTransfer.getData("row"));
        if (tilesInHand[index] !== null) {
            if (!draggedIndex) {
                showAlertModal("Error", "Space is not free! \nSwapping is only possible between two tiles in Hand.");
                return;
            }
            const newTilesInHand = [...tilesInHand]; //copy so useEffect registers a change
            newTilesInHand[index] = draggedImage; //replace drop location src with original src
            newTilesInHand[parseInt(draggedIndex)] = tilesInHand[index]; //replace original src with drop location src
            setTilesInHand(newTilesInHand);
            const indIncluded = selectedTiles.includes(index);
            const draggedIncluded = selectedTiles.includes(parseInt(draggedIndex));
            if ((indIncluded || draggedIncluded) && !(indIncluded && draggedIncluded)) { //XOR?
                if (indIncluded) {
                    setSelectedTiles(prev => prev.map(tile => tile === index ? parseInt(draggedIndex) : tile));
                }
                else {
                    setSelectedTiles(prev => prev.map(tile => tile === parseInt(draggedIndex) ? index : tile));
                }
            }
            
        } else {
            // If the target is empty, swap the images
            if (draggedImage){
                const newTilesInHand = [...tilesInHand];
                newTilesInHand[index] = draggedImage;
                newTilesInHand[parseInt(draggedIndex)] = null;
                setTilesInHand(newTilesInHand);
            }
            if (draggedCol && draggedRow) {
                const keyFrom = `${draggedCol}-${draggedRow}`;
                setBoardTiles(prev => {
                    const updated = { ...prev };
                    delete updated[keyFrom];  // Clear the dragged tile from its original position
                    return updated;
                });
            }
        }
    };
    
    const handleBoardDrop = (e: React.DragEvent, col: number, row: number) => {
        e.preventDefault();
        const keyTo = `${col}-${row}`;


        const draggedIndex = parseInt(e.dataTransfer.getData("index"));
        const draggedImage = e.dataTransfer.getData("imageSrc");
        const draggedCol = parseInt(e.dataTransfer.getData("col"));
        const draggedRow = parseInt(e.dataTransfer.getData("row"));
        const draggedImageFromBoard = e.dataTransfer.getData("imageSrc");


        if (boardTiles[keyTo] || immutableBoardTiles[keyTo]) {
            showAlertModal("Error", "Space is not free!");
        }
        else {
        // Handling dropping an image from the hand to the board
            if (draggedIndex !== null && isNaN(draggedCol) && isNaN(draggedRow)) {
                const newTilesInHand = [...tilesInHand];
                newTilesInHand[draggedIndex] = null;
                setTilesInHand(newTilesInHand);
                
                const key = `${col}-${row}`;
                setBoardTiles(prev => ({
                    ...prev,
                    [key]: draggedImage
                }));
                if (selectedTiles.includes(draggedIndex)) {
                    setSelectedTiles(prev => prev.filter(index => index !== draggedIndex));
                }
            }
            // Handling dropping an image from the board to another board tile
            else {
                const keyFrom = `${draggedCol}-${draggedRow}`;
                
                // Remove image from original board tile
                const updatedBoardTiles = { ...boardTiles };
                if (keyFrom !== keyTo) {
                    delete updatedBoardTiles[keyFrom];
                    updatedBoardTiles[keyTo] = draggedImageFromBoard;
                }
                
                setBoardTiles(updatedBoardTiles);
            }
        }
    };
    
    // Handle drag over (to allow dropping)
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Allow drop
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLImageElement;
        target.classList.remove('dragging');
    }
    
    useEffect(() => {
        //if (!token) return;
        const mutableTiles = Object.keys(boardTiles).filter(key => !immutableBoardTiles[key]);
        setTileOnBoard(mutableTiles.length > 0);
        setMoveVerified(false);
        setTileSelected(selectedTiles.length > 0);
    }, [boardTiles, selectedTiles, tilesInHand, playerPoints, immutableBoardTiles]);

    useEffect(() => {
        //if (!token) return;
        setUserTurn(userId === playerAtTurn.id.toString()); // Update user turn based on the current player at turn
        console.log("User Turn: ", userId === playerAtTurn.id.toString()); //necessary log so that ui correctly updates.
    }, [playerAtTurn, userId]); // Add playerAtTurn as a dependency


    useEffect(() => {
        //if (!token) return;

        if (!lastVoteTime) {
            setVoteCooldownRemaining(null); // No vote has been sent yet
            return;
        }
    
        const interval = setInterval(() => {
            const currentTime = Date.now();
            const timeSinceLastVote = currentTime - lastVoteTime;
            const cooldownRemaining = Math.max(0, 5 * 60 * 1000 - timeSinceLastVote); // 5 minutes in milliseconds
    
            setVoteCooldownRemaining(cooldownRemaining);
    
            if (cooldownRemaining === 0) {
                clearInterval(interval); // Stop the interval when the cooldown ends
            }
        }, 1000);
    
        return () => clearInterval(interval); // Cleanup the interval on unmount
    
    }, [lastVoteTime]);

    useEffect(() => {
        //if (!token) return;

        const startTime = Date.now(); // Simulate server start time
        const endTime = startTime + 45 * 60 * 1000; // 45 minutes later
        const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setRemainingTime(timeLeft);
    
        //setIsGameStarted(true); // Automatically start the game    
    
        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer); // Stop the timer when it reaches 0
                    handleGameEnd(); // End the game
                    return 0;
                }
                return prev - 1; // Decrease remainingTime by 1
            });
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup the timer when the component unmounts
    }, []); // Empty dependency array ensures this runs only once

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const sendTimerSyncMessage = () => {
        if (!id || !token || !stompClientRef.current) return;
        const messageBody: GameState = {
            id: id.toString(),
            board: Array(15).fill(Array(15).fill("")),
            token: token!,
            userTiles: Array(7).fill(""),
            action: "TIMER",
            playerId: localStorage.getItem("userId")!,
        };
        sendMessage(JSON.stringify(messageBody));
    };

    useEffect(() => {
        if (!token) return;
        const interval = setInterval(() => {
            sendTimerSyncMessage();
        }, 60000); // every 60 seconds
        return () => clearInterval(interval);
    }, [token, id]);

    useEffect(() => {
        if (playerAtTurn.id.toString() !== userId) return; // Only start the timer if it's the user's turn // || !token

        const countdownTimer = setInterval(() => {
          setTurnTimeLeft((prev) => {
            if (prev > 0) {
                if (alreadySkippedRef.current) alreadySkippedRef.current = false; // Reset alreadySkipped when the timer is running
                return prev - 1;
            } else {
                if (alreadySkippedRef.current) {return 0;} // Prevent skipping if already skipped
                clearInterval(countdownTimer); // Stop the timer when it reaches 1
                skipTurn(); // Call the skipTurn function
                return 0;
            }
          });
        }, 1000);
      
        return () => clearInterval(countdownTimer); // Cleanup on unmount
      }, [playerAtTurn]);

    const assignTilesToPlayer = async (count: number) => {
        try {
            const response = await apiService.put<GamePutDTO>(
                `/games/${id}/assign?count=${count}`,
                {}
            );
            if (response && response.newTiles) {
                const startingTiles = response.newTiles.map(
                    (letter: string) => `/letters/${letter} Tile 70.jpg`
                );
                // Update the tiles for the specific user
                setTilesInHand(startingTiles);
            }
        } catch (error) {
            console.error("Error assigning tiles:", error);
            showAlertModal(`${(error as Error).message}`, "Failed to assign tiles.")
        }
    };

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    // if (!isAuthenticated) {
    //     return null;
    // }

    return (
        <div id="screen">
            <div id="board-container">
                <Board
                    boardTiles={boardTiles}
                    immutableBoardTiles={immutableBoardTiles}
                    isInteractive={true} // Enable interactivity
                    onDragOver={handleDragOver}
                    onDrop={handleBoardDrop}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onTileClick={handleTileClick}
                />
            </div>
            <div id="rest-container">
                <div id="top">
                    <div id="time-surrender">
                        <div id="timer">
                            {formatTime(remainingTime)}
                        </div>
                        <div id="turn-timer">
                        {isUserTurn && (
                            <div className="timer-bar-container">
                                <div
                                className="timer-bar"
                                style={{ width: `${(turnTimeLeft / 180) * 100}%` }}
                                ></div>
                            </div>)}
                        </div>
                        <div id = "end_buttons">
                            <div id="end_vote">
                                <button 
                                id="end_vote_button" 
                                className="nav_button"
                                onClick={handleVote}>
                                    {voteCooldownRemaining !== null && voteCooldownRemaining > 0
                                        ? `Vote in ${Math.max(0, Math.floor(voteCooldownRemaining / 1000))}s`
                                        : "Vote to end"}
                                </button>
                            </div>
                            <div id="surrender">
                                <button 
                                id="surrender-button" 
                                className="nav_button"
                                onClick={() => showDecisionModal("Surrender", "Are you sure you want to surrender?")}>
                                    Give Up
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="turn-points">
                        <div id="t-p-container">
                            <div className="player-container" id="left-player">
                                <div className="name-and-dot-container">
                                    <div className="player-name">
                                        {gameHost.username ? gameHost.username : "Host"}
                                    </div>
                                    <div className="dot-container">                                
                                        <div className={`turn-dot ${playerAtTurn === gameHost ? 'active-dot' : ''}`}>
                                        </div>
                                    </div>
                                </div>
                                <div className="player-points">
                                    {playerPoints[gameHost.id]}
                                </div>
                            </div>
                            <div className="player-container">
                                <div className="name-and-dot-container">
                                    <div className="player-name">
                                        {gameGuest.username ? gameGuest.username : "Guest"}
                                    </div>
                                    <div className="dot-container">                                
                                        <div className={`turn-dot ${playerAtTurn === gameGuest ? 'active-dot' : ''}`}>

                                        </div>
                                    </div>
                                </div>
                                <div className="player-points">
                                    {playerPoints[gameGuest.id]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="bag-stuff">
                    <div id="bag-image">
                        <Image id="bag-jpg" src="/BagWithTiles.png" alt="Letters Bag" width={222} height={168} priority /> {/* without tiles: /TilesBag.png*/}
                    </div>
                    <div id="bag-info">
                        <div id="bag-interaction">
                            <div id="bag-input-container">
                                <input 
                                    type="text"
                                    id="bag-input"
                                    value={letter}
                                    onChange={(e) => {
                                        setLetter(e.target.value);
                                        setShowNumber(false); // Reset to show the button when a new letter is entered
                                    }}
                                    maxLength={1}
                                    placeholder="// Letter"
                                />
                            </div>
                            {!showNumber ? ( // Show the button if `showNumber` is false
                                <div id="bag-button-container">
                                        <button 
                                            id="bag-button" 
                                            onClick={handleCheck}
                                            disabled={!letter}
                                            style={{ 
                                                opacity: letter ? 1 : 0.9,
                                                cursor: letter ? "pointer" : "not-allowed",
                                            }}
                                            title={!letter ? "Type a letter to request the info" : ""}
                                        >
                                            Ask
                                        </button>
                                </div>
                                ) : (
                                <div id="bag-number-container">
                                    <div id="bag-number">
                                        {number || 0} tiles
                                    </div>
                                </div>
                                )}
                        </div>
                    </div>
                </div>
                <div id="tiles-storage-container">
                    <div id="undo-button">
                    {isTileOnBoard &&(
                        <Image
                        id="undo-button-image"
                        width={100}
                        height={100}
                        src={"/undoArrow.png"}
                        onClick={handleReturn}
                        alt={"Undo Arrow"}
                        />
                    )}
                </div>
                {tilesInHand.map((src, index) => (
                    <div 
                    key={index} 
                    id={index.toString()} 
                    className="tile-placeholder"
                    onDragOver={handleDragOver}
                    onDrop={(e)=> handleHandDrop(e, index) }
                    >
                    {src && (
                        <Image 
                        onClick={() => toggleTileSelection(index)}
                        className={`tile-${selectedTiles.includes(index) ? "selected" : ""}`}
                        src={src} 
                        alt={`Tile ${index}`} 
                        width={100}
                        height={100} 
                        draggable
                        onDragStart={(e)=>handleHandDragStart(e, index)}
                        onDragEnd = {handleDragEnd}
                        />
                    )}
                    </div>
                ))}
                </div>
                <div id="game-buttons">
                    <div id="upper-row-container">
                        <div id="verify-button-container">
                            <Button onClick = {verifyWord} 
                            id="verify-button"  
                            className="game-buttons"
                            disabled={!isTileOnBoard}
                            style= {{ opacity: isTileOnBoard ? 1 : 0.9}}
                            title={!isTileOnBoard ? "Place a tile on the board to verify a word" : ""}>
                                Verify
                            </Button>
                        </div>
                        <div id="exchange-button-container">
                            <Button onClick = {() => exchangeTiles()} 
                            id="exhange-button" 
                            className="game-buttons"
                            disabled = {!isTileSelected || !isUserTurn}
                            style = {{ opacity: isTileSelected ? 1 : 0.9}}
                            title = { !isTileSelected 
                                    ? "Select a tile to exchange it" 
                                    : !isUserTurn
                                    ? "It's not your turn"
                                    : ""}>
                                Exchange
                            </Button>
                        </div>
                        <div id="skip-button-container">
                            <Button onClick = {skipTurn} 
                            id="skip-button" 
                            className="game-buttons"
                            disabled = {!isUserTurn}
                            style = {{ opacity: isUserTurn ? 1 : 0.9}}
                            title = { !isUserTurn ? "Wait for your turn to skip" : ""}>
                                Skip
                            </Button>
                        </div>
                    </div>
                    <div id="lower-row-container">
                        <div id="commit-button-container">
                            <Button onClick = {commitWord} 
                            id="commit-button" 
                            className="game-buttons"
                            disabled = {!isMoveVerified || !isUserTurn}
                            style = {{ opacity: isMoveVerified ? 1: 0.9}}
                            title={!isMoveVerified 
                                    ? "Verify a word before playing it" 
                                    : !isUserTurn
                                    ? "It's not your turn"
                                    : ""
                                    }>
                                Play Word
                            </Button>
                        </div>
                    </div>
                    <CustomAlertModal
                    visible={alertModalVisible}
                    title={alertModalTitle}
                    message={alertModalMessage}
                    onClose={alertModalTitle === "Game Over" ? handleGameOverClose : handleModalClose}
                    />
                    <CustomDecisionModal
                    visible={decisionModalVisible}
                    title={decisionModalTitle}
                    message={decisionModalMessage}
                    onConfirm={decisionModalTitle === "Vote" ? handleGameEnd : handleSurrender}
                    onCancel={decisionModalTitle === "Vote" ? handleDecline : handleModalClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default Gamestate;
