"use client"; // Required for using React hooks in Next.js

import { useParams } from "next/navigation"; // use NextJS router for navigation
import React, { useState, useEffect, useRef } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Button } from "antd"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { CustomAlertModal } from "@/components/customModal"; // Import CustomAlertModal
import { getApiDomain } from "@/utils/domain";

// TODO: Replace some alerts with customModal

// Generate specialTiles outside the component to prevent re-execution
const generateSpecialTiles = () => {
    const specialTiles: { [key: string]: string } = {};
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            // Triple Word (Triple-Word-Score)
            if (
                (row === 14 && (col === 7 || col === 14)) ||
                (row === 7 && col === 14) || 
                (row === 14 && col === 14) || 
                (row === 0 && col % 7 === 0) || 
                (col === 0 && row % 7 === 0)
              ) {
                const key = `${col}-${row}`;
                specialTiles[key] = 'Triple-Word-Score';
                continue;  // Assign 'Triple-Word-Score' class for triple word tiles
            }

            // Double Letter (Double-Letter-Score)
            if (
                ((col === 3 || col === 11) && [0, 7, 14].includes(row)) ||
                ((col === 6 || col === 8) && [2, 6, 8, 12].includes(row)) ||
                (col === 7 && [3, 11].includes(row)) ||
                (([0, 14].includes(col)) && [3, 11].includes(row)) ||
                (([2, 12].includes(col)) && [6, 8].includes(row))

            ) {
                const key = `${col}-${row}`;
                specialTiles[key] = 'Double-Letter-Score';
                continue; 
            }

            // Double Word (Double-Word-Score)
            if (
                (col === row && [1, 2, 3, 4, 10, 11, 12, 13].includes(row)) ||
                (col + row === 14 && [1, 2, 3, 4, 10, 11, 12, 13].includes(row))
            ) {
                const key = `${col}-${row}`;
                specialTiles[key] = 'Double-Word-Score';
                continue; 
            }

            // Triple Letter (Triple-Letter-Score)
            if (
                ((col === 1 || col === 13) && [5, 9].includes(row)) ||
                ((col === 5 || col === 9) && [1, 5, 9, 13].includes(row))

            ) {
                const key = `${col}-${row}`;
                specialTiles[key] = 'Triple-Letter-Score';
                continue; 
            }

            // center
            if (
                col === 7 && row ===7
            )
                {
                    const key = "7-7";
                    specialTiles[key] = 'Center';
                    continue; 
                }
            
            const key = `${col}-${row}`;
            specialTiles[key] = 'Base'; 
        }
    }
    return specialTiles;
};

const specialTiles = generateSpecialTiles();


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
    const [letter, setLetter] = useState("");
    const [number, setNumber] = useState<number | null>(null);
    // const [submittedLetter, setSubmittedLetter] = useState("");
    const apiService = useApi();
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [tilesInHand, setTilesInHand] = useState <(string | null)[]>(new Array(7).fill(null));
    const [selectedTiles, setSelectedTiles ] = useState<number[]>([]);
    const [boardTiles, setBoardTiles] = useState<{ [key:string]: string | null }>({});
    const [immutableBoardTiles, setImmutableBoardTiles] = useState<{ [key:string]: string | null }>({});
    const [isUserTurn, setUserTurn] = useState(true);
    const [playerAtTurn, setPlayerAtTurn] = useState<User>(defaultUser);
    const [isTileOnBoard, setTileOnBoard] = useState(false);
    const [isMoveVerified, setMoveVerified] = useState(false);
    const [isTileSelected, setTileSelected] = useState(false);
    // const [messages, setMessages] = useState<string[]>([]);
    const { id } = useParams();
    const stompClientRef = useRef<Client | null>(null);
    const [remainingTime, setRemainingTime] = useState(45 * 60); // 45 minutes in seconds
    // const [isGameStarted, setIsGameStarted] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const URL = getApiDomain();
    const [playerPoints, setPlayerPoints] = useState< {[key:string]: number | null}>({}); // initialize with 0 points each
    const [gameHost, setGameHost] = useState<User>(defaultUser);
    const [gameGuest, setGameGuest] = useState<User>(defaultUser);
    const [isInitialized, setIsInitialized] = useState(false);
    const tilesInHandRef = useRef<(string | null)[]>(tilesInHand); // Create a ref to store the tiles in hand
    const [showNumber, setShowNumber] = useState(false); // New state to toggle between button and number


    useEffect(()=> {
        setToken(localStorage.getItem("token"));
        setUserId(localStorage.getItem("userId"));
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
        if (!isInitialized) return; // Wait until the game data is fetched


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
                    if (response.messageStatus.toString() === "VALIDATION_SUCCESS") {
                        showModal("Validation", "Validation successful!");
                        setMoveVerified(true);
                    } 
                    else if (response.messageStatus.toString() === "VALIDATION_ERROR") {
                        showModal("Validation", `Validation failed! Reason: ${response.message.toString().substring(16)}`);
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
                    console.log("Received WebSocket message:", message.body);
                    const response = JSON.parse(message.body);
                
                    if (response.message === "Game has been terminated successfully." && response.messageStatus === "SUCCESS") {
                        console.log("Game has ended. Reason: Surrender or Time is up");
                        showModal("Game Over", "The game has ended!");
                        handleGameEnd();
                        return;
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
    
    // const disconnectWebSocket = () => {
    //     if (stompClientRef.current) {
    //         console.log("Manually disconnecting from WebSocket.");
    //         stompClientRef.current.deactivate();
    //     }
    // };

    const sendMessage = (messageBody: string) => {
        if (stompClientRef.current) {
            stompClientRef.current.publish({
                destination: `/ws/game_states/${id}`,
                body: messageBody,
            });
        }

    };

    const showModal = (title: string, message: string) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
      };
    
    const handleModalClose = () => {
        setModalVisible(false);
    };
    
    // Function to get the tile class
    const getTileClass = (row: number, col: number) => {
        const key = `${col}-${row}`;
        return specialTiles[key];
    };

    const handleCheck = async () => {
        if (letter.length !== 1 || !/[a-zA-Z]/.test(letter)) { // ! Never reached since button is disabled
            showModal("Error", "Please enter a single letter.");
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
            showModal("Error", `Failed to retrieve letter count: ${(error as Error).message}`);
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
        showModal("Exchange", `${exchangeList} were exchanged.`)

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
                setUserTurn(false); // Toggle user turn after exchange
            }
        }
        catch (error) {
            console.error("Exchange Error:", error);
            showModal("Error", `Exchange failed: ${(error as Error).message}`);
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
            action: "SKIP",
            playerId: localStorage.getItem("userId")!,
        };
    
        // Convert the object to a JSON string before sending
        sendMessage(JSON.stringify(messageBody));
    };
    

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
        tilesInHandRef.current = tilesInHand; // Update the ref whenever tilesInHand changes
    }, [tilesInHand])

    const handleSurrender = () => {
        if (!id || !stompClientRef.current) {
            console.error("Game ID or WebSocket client is null or undefined.");
            showModal("Error", "Cannot surrender. Game ID or WebSocket connection is missing.");
            return;
        }
    
        stompClientRef.current.publish({
            destination: `/ws/game_states/${id}`,
            body: JSON.stringify({
                action: "GAME_END",
                reason: "SURRENDER",
                playerId: localStorage.getItem("userId"),
                id: id,
                token: token,
                userTiles: [],
                board: [],
            }),
        });
    
        console.log("Sent GAME_END message:", {
            action: "GAME_END",
            reason: "SURRENDER",
            playerId: localStorage.getItem("userId"),
            id: id,
        });
    
        showModal("Surrender", "You have surrendered!");
    };

    const handleGameEnd = () => {
        showModal("Game Over", "The game has ended.");
        router.push(`/endstate/${id}`);
    };

    const handleReturn = () => {
        // Make copies so we can mutate them safely
        const updatedHand = [...tilesInHand];
        const updatedBoard = { ...boardTiles };

        for (const key in boardTiles) {
            if (immutableBoardTiles[key]) continue; // Skip immutable tiles


            const image = boardTiles[key];
            const emptyIndex = updatedHand.findIndex(tile => tile === null);

            if (emptyIndex !== -1 && image) {
                updatedHand[emptyIndex] = image;
                delete updatedBoard[key];
            } else {
                // Optional: alert or handle situation where hand is full
                console.warn(`No space in hand to return tile from board position ${key}`);
            }
        }

        setTilesInHand(updatedHand);
        setBoardTiles(updatedBoard);
    }

    // const setHandImageAt = (index: number, imagePath: string | null) => {
    //     setTilesInHand(prev => {
    //         const updated = [...prev];
    //         updated[index] = imagePath;
    //         return updated;
    //     })
    // }

      // Handle drag start
    const handleDragStart = (e: React.DragEvent, index: number | null, col: number | null, row: number | null) => {
        if (index !== null) {
            e.dataTransfer.setData("index", index.toString()); // Store the image index from inside the hand
            e.dataTransfer.setData("imageSrc", tilesInHand[index] || ''); // Store the image source
        } else if (col !== null && row !== null) {
            e.dataTransfer.setData("col", col.toString());
            e.dataTransfer.setData("row", row.toString());
            e.dataTransfer.setData("imageSrc", boardTiles[`${col}-${row}`] || '');
        }
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
                showModal("Error", "Space is not free! \nSwapping is only possible between two tiles in Hand.");
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
            showModal("Error", "Space is not free!");
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
        const mutableTiles = Object.keys(boardTiles).filter(key => !immutableBoardTiles[key]);
        setTileOnBoard(mutableTiles.length > 0);
        setMoveVerified(false);
        setTileSelected(selectedTiles.length > 0);
    }, [boardTiles, selectedTiles, tilesInHand, playerPoints, immutableBoardTiles]);

    useEffect(() => {
        setUserTurn(userId === playerAtTurn.id.toString()); // Update user turn based on the current player at turn
    }, [playerAtTurn, userId]); // Add playerAtTurn as a dependency

    // TODO: For a robust solution, use the server-side timer with periodic synchronization
    useEffect(() => {
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
            showModal(`${(error as Error).message}`, "Failed to assign tiles.")
        }
    };

    return (
        <div id="screen">
            <div id="board-container">
                <div id="game-board" style={{
                    gridTemplateColumns: 'repeat(15, 1fr)',
                    gridTemplateRows: 'repeat(15, 1fr)',
                }}>
                    {[...Array(15)].map((_, row) => (
                        [...Array(15)].map((_, col) => {
                            const tileClass = getTileClass(row, col);
                            return (
                                <div key={`${col}-${row}`} 
                                    id={`tile-${col}-${row}`} 
                                    data-coordinates={`(${col},${row})`} 
                                    className={tileClass}
                                    onDragOver={handleDragOver}
                                    title = {tileClass}
                                    onDrop={(e) => handleBoardDrop(e, col, row)}
                                    >
                                       {boardTiles[`${col}-${row}`] && (
                                        <Image 
                                            src={boardTiles[`${col}-${row}`] || "/letters/empty tile 70.jpg"} 
                                            alt={`Tile at ${col}-${row}`} 
                                            className={`board-tiles ${immutableBoardTiles[`${col}-${row}`] ? 'immutable-tile' : ''}`}
                                            width={100} 
                                            height={100}
                                            draggable = {!immutableBoardTiles[`${col}-${row}`]} // Disable dragging for immutable tiles
                                            onDragStart={(e) => handleDragStart(e, null, col, row)} 
                                            onDragEnd = {handleDragEnd}
                                        /> 
                                        )}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
            <div id="rest-container">
                <div id="top">
                    <div id="time-surrender">
                        <div id="timer">
                            {formatTime(remainingTime)}
                        </div>
                        <div id="surrender">
                            <button 
                            id="surrender-button" 
                            className="nav_button"
                            onClick={handleSurrender}>
                                Give Up
                            </button>
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
                        onDragStart={(e)=>handleDragStart(e, index, null, null)}
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
                    visible={modalVisible}
                    title={modalTitle}
                    message={modalMessage}
                    onClose={handleModalClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default Gamestate;
