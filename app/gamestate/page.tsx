"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
//import { useRouter } from "next/navigation";
import Image from "next/image";
import "./gamestate.css";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

const Gamestate: React.FC = () => {
    const [letter, setLetter] = useState("");
    const [number, setNumber] = useState<number | null>(null);
    const [submittedLetter, setSubmittedLetter] = useState("");
    // Initialize the specialTiles dictionary
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
                    const key = `7-7`;
                    specialTiles[key] = 'Center';
                    continue; 
                }
            
            const key = `${col}-${row}`;
            specialTiles[key] = 'Base'; 
        }
    }

    // Function to check if a tile is special and return its class
    const getTileClass = (row: number, col: number) => {
        const key = `${col}-${row}`;
        return specialTiles[key]; // Return the class if special, otherwise empty
    };

    const handleTileClick = (row: number, col: number) => {
        const tileClass = getTileClass(row, col); // Get the class for the clicked tile
        alert(`Tile clicked at (${col}, ${row}) with class: ${tileClass}`);
    };

    const handleCheck = async () => {
        if (letter.length !== 1 || !/[a-zA-Z]/.test(letter)) {
            alert("Please enter a single letter.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/gamestate/get-remaining-${letter}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json();
            setNumber(data.number);
            setSubmittedLetter(letter.toUpperCase());
        } catch (error) {
            console.error("Error fetching data:", error);
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
                    const tileClass = getTileClass(row,col);
                    return(
                        <div key={`${col}-${row}`} 
                            id={`tile-${col}-${row}`} 
                            data-coordinates={`(${col},${row})`} 
                            className={`${tileClass}`}
                            onClick={() => handleTileClick(row, col)}
                                >
                            {/* Tile content will go here */}
                        </div>
                    )
                })
              ))}
            </div>
          </div>



          <div id="rest-container">
            <div id="top"></div>
            <div id="bag-stuff">
              <div id="bag-image">
                <Image
                    id = "bag-jpg"
                    src="/TilesBag.png"
                    alt="Letters Bag"
                    width={248}
                    height={204}
                    priority
                />
              </div>
              <div id="bag-info">
                <div id="bag-description-container">
                    <div id="bag-description">
                        Ask the bag for remaining tiles
                    </div>
                </div>
                <div id="bag-interaction">
                    <div id="bag-input-container">
                        <input 
                        type="text"
                        id="bag-input"
                        value={letter}
                        onChange={(e) => setLetter(e.target.value)} // Ensure only 1 letter
                        maxLength={1}
                        placeholder="// Letter"
                        />
                    </div>
                    <div id="bag-button-container">
                        <button 
                        id="bag-button" 
                        onClick={handleCheck}
                        >
                            Ask
                        </button>
                    </div>
                </div>
                <div id="tiles-info-container">
                    <div>
                        Remaining {submittedLetter || '{x}'}:
                    </div>
                    <div>
                        {number || 0}
                    </div>
                </div>
              </div>
            </div>
            <div id="game-buttons"></div>
          </div>
        </div>
      );
    };

export default Gamestate;
