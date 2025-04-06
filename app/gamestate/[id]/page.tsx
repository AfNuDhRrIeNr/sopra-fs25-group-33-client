"use client"; // Required for using React hooks in Next.js

import React, { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Button } from "antd"; 
import Image from "next/image";
import "../gamestate.css";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";

import "../gamestate.css";

// Generate specialTiles outside the component to prevent re-execution
const generateSpecialTiles = () => {
    const specialTiles: { [key: string]: string } = {};
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            // Triple Word (TW)
            if (
                (row === 14 && (col === 7 || col === 14)) ||
                (row === 7 && col === 14) || 
                (row === 14 && col === 14) || 
                (row === 0 && col % 7 === 0) || 
                (col === 0 && row % 7 === 0)
              ) {
                const key = `${col}-${row}`;
                specialTiles[key] = 'TW';
                continue;  // Assign 'TW' class for triple word tiles
            }

            // Double Letter (DL)
            if (
                ((col === 3 || col === 11) && [0, 7, 14].includes(row)) ||
                ((col === 6 || col === 8) && [2, 6, 8, 12].includes(row)) ||
                (col === 7 && [3, 11].includes(row)) ||
                (([0, 14].includes(col)) && [3, 11].includes(row)) ||
                (([2, 12].includes(col)) && [6, 8].includes(row))

            ) {
                const key = `${col}-${row}`;
                specialTiles[key] = 'DL';
                continue; 
            }

            // Double Word (DW)
            if (
                (col === row && [1, 2, 3, 4, 10, 11, 12, 13].includes(row)) ||
                (col + row === 14 && [1, 2, 3, 4, 10, 11, 12, 13].includes(row))
            ) {
                const key = `${col}-${row}`;
                specialTiles[key] = 'DW';
                continue; 
            }

            // Triple Letter (TL)
            if (
                ((col === 1 || col === 13) && [5, 9].includes(row)) ||
                ((col === 5 || col === 9) && [1, 5, 9, 13].includes(row))

            ) {
                const key = `${col}-${row}`;
                specialTiles[key] = 'TL';
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


interface Tile {
    letter: string;
    remaining: number;
}

const Gamestate: React.FC = () => {
    const [letter, setLetter] = useState("");
    const [number, setNumber] = useState<number | null>(null);
    const [submittedLetter, setSubmittedLetter] = useState("");
    const apiService = useApi();
    const userId = localStorage.getItem("userId")
    const [tileImages, setTileImages] = useState <(string | null)[]>(new Array(7).fill(null));
    const [boardTiles, setBoardTiles] = useState<{ [key:string]: string | null }>({});

    // Function to get the tile class
    const getTileClass = (row: number, col: number) => {
        const key = `${col}-${row}`;
        return specialTiles[key];
    };

    const handleTileClick = (row: number, col: number) => {
        const tileClass = getTileClass(row, col);
        alert(`Tile clicked at (${col}, ${row}) with class: ${tileClass}`);
    };

    const handleCheck = async () => {
        if (letter.length !== 1 || !/[a-zA-Z]/.test(letter)) {
            alert("Please enter a single letter.");
            return;
        }
        try 
        {
            const response = await apiService.get<Tile>(`/gamestate/users/${userId}/remaining/${letter}`);
        
            if (response != null) {
                setNumber(response.remaining);
                setSubmittedLetter(response.letter.toUpperCase());
                setLetter("");
            }
        } catch (error) {
            console.error("Retrieval Error:", error);
            alert(`Retrieval failed: ${(error as Error).message}`);
        }
    };

    const verifyWord = () => {
        alert("WordVerify");
    }

    const exchangeTiles = () => {
        alert("Exchange");
    }

    const skipTurn = () => {
        alert("Skip");
    }

    const commitWord = () => {
        alert("WordCommited");
    }

    const setTileImageAt = (index: number, imagePath: string | null) => {
        setTileImages(prev => {
            const updated = [...prev];
            updated[index] = imagePath;
            return updated;
        })
    }

      // Handle drag start
    const handleDragStart = (e: React.DragEvent, index: number | null, col: number | null, row: number | null) => {
        if (index !== null) {
            e.dataTransfer.setData("index", index.toString()); // Store the image index from inside the hand
            e.dataTransfer.setData("imageSrc", tileImages[index] || ''); // Store the image source
        } else if (col !== null && row !== null) {
            e.dataTransfer.setData("col", col.toString());
            e.dataTransfer.setData("row", row.toString());
            e.dataTransfer.setData("imageSrc", boardTiles[`${col}-${row}`] || '');
        }
        
        const target = e.target as HTMLImageElement; //set original e (e meaning event) (e.target) type as htmlimage
        target.style.opacity = '0'; //set opacity to 0 to fake moving the tile
        
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

        // If the target is empty, swap the images
        if (draggedImage && !tileImages[index]) {
            const newTileImages = [...tileImages];
            newTileImages[index] = draggedImage;
            newTileImages[parseInt(draggedIndex)] = null;
            setTileImages(newTileImages);
        }
        if (draggedCol && draggedRow) {
            const keyFrom = `${draggedCol}-${draggedRow}`;
            setBoardTiles(prev => {
                const updated = { ...prev };
                delete updated[keyFrom];  // Clear the dragged tile from its original position
                return updated;
            });
        }
    };

    const handleBoardDrop = (e: React.DragEvent, col: number, row: number) => {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("index"));
        const draggedImage = e.dataTransfer.getData("imageSrc");

        // Handling dropping an image from the hand to the board
        if (draggedIndex) {
            const newTileImages = [...tileImages];
            newTileImages[draggedIndex] = null;
            setTileImages(newTileImages);

            const key = `${col}-${row}`;
            setBoardTiles(prev => ({
                ...prev,
                [key]: draggedImage
            }));
        }
        // Handling dropping an image from the board to another board tile
        else {
            const draggedCol = parseInt(e.dataTransfer.getData("col"));
            const draggedRow = parseInt(e.dataTransfer.getData("row"));
            const draggedImageFromBoard = e.dataTransfer.getData("imageSrc");

            const keyFrom = `${draggedCol}-${draggedRow}`;
            const keyTo = `${col}-${row}`;

            // Remove image from original board tile
            setBoardTiles(prev => {
                const updated = { ...prev };
                delete updated[keyFrom];  // Clear the dragged tile from its original position
                updated[keyTo] = draggedImageFromBoard;  // Place it on the new tile
                return updated;
            });
        }
    };

    // Handle drag over (to allow dropping)
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Allow drop
    };

    useEffect(() => {
        setTileImageAt(0, "/letters/A Tile 70.jpg");
        setTileImageAt(1, "/letters/B Tile 70.jpg");
        setTileImageAt(2, "/letters/S Tile 70.jpg");
        setTileImageAt(3, "/letters/R Tile 70.jpg");
        setTileImageAt(4, "/letters/T Tile 70.jpg");
        setTileImageAt(5, "/letters/T Tile 70.jpg");
        setTileImageAt(6, "/letters/H Tile 70.jpg");
    }, []);

    useEffect(() => {
        console.log(boardTiles);
    }, [boardTiles]);


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
                                    onDrop={(e) => handleBoardDrop(e, col, row)}
                                    >
                                       {boardTiles[`${col}-${row}`] && (
                                        <Image 
                                            src={boardTiles[`${col}-${row}`] || "/letters/empty tile 70.jpg"} 
                                            alt={`Tile at ${col}-${row}`} 
                                            className="board-tiles"
                                            width={100} 
                                            height={100}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, null, col, row)} 
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

                </div>
                <div id="bag-stuff">
                    <div id="bag-image">
                        <Image id="bag-jpg" src="/TilesBag.png" alt="Letters Bag" width={222} height={168} priority />
                    </div>
                    <div id="bag-info">
                        <div id="bag-description-container">
                            <div id="bag-description">Ask the bag for remaining tiles</div>
                        </div>
                        <div id="bag-interaction">
                            <div id="bag-input-container">
                                <input 
                                    type="text"
                                    id="bag-input"
                                    value={letter}
                                    onChange={(e) => setLetter(e.target.value)}
                                    maxLength={1}
                                    placeholder="// Letter"
                                />
                            </div>
                            <div id="bag-button-container">
                                <button id="bag-button" onClick={handleCheck}>Ask</button>
                            </div>
                        </div>
                        <div id="tiles-info-container">
                            <div>Remaining {submittedLetter || '{x}'}:</div>
                            <div>{number || 0}</div>
                        </div>
                    </div>
                </div>
                <div id="tiles-storage-container">
                {tileImages.map((src, index) => (
                    <div 
                    key={index} 
                    id={index.toString()} 
                    className="tile-placeholder"
                    onDragOver={handleDragOver}
                    onDrop={(e)=> handleHandDrop(e, index) }
                    >
                    {src && (
                        <Image 
                        className="tiles"
                        src={src} 
                        alt={`Tile ${index}`} 
                        width={100}
                        height={100} 
                        draggable
                        onDragStart={(e)=>handleDragStart(e, index, null, null)}
                        />
                    )}
                    </div>
                ))}
                </div>
                <div id="game-buttons">
                    <div id="upper-row-container">
                        <div id="verify-button-container">
                            <Button onClick = {verifyWord} id="verify-button"  className="game-buttons">
                                Verify
                            </Button>
                        </div>
                        <div id="exchange-button-container">
                            <Button onClick = {() => exchangeTiles()} id="exhange-button" className="game-buttons">
                                Exchange
                            </Button>
                        </div>
                        <div id="skip-button-container">
                            <Button onClick = {skipTurn} id="skip-button" className="game-buttons">
                                Skip
                            </Button>
                        </div>
                    </div>
                    <div id="lower-row-container">
                        <div id="commit-button-container">
                            <Button onClick = {commitWord} id="commit-button" className="game-buttons">
                                Play Word
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gamestate;
