"use client"; // Required for using React hooks in Next.js

import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import Image from "next/image";
import "../gamestate.css";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";

import "./gamestate.css";

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
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleTileClick(row, col)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            handleTileClick(row, col);
                                        }
                                    }}>
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
            <div id="rest-container">
                <div id="top"></div>
                <div id="bag-stuff">
                    <div id="bag-image">
                        <Image id="bag-jpg" src="/TilesBag.png" alt="Letters Bag" width={248} height={204} priority />
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
                <div id="game-buttons"></div>
            </div>
        </div>
    );
};

export default Gamestate;
