import React from "react";
import Image from "next/image";

interface BoardProps {
    boardTiles: { [key: string]: string | null };
    immutableBoardTiles: { [key: string]: string | null };
    // specialTiles: { [key: string]: string };
    isInteractive?: boolean; // Determines if the board is interactive
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent, col: number, row: number) => void;
    onDragStart?: (e: React.DragEvent, col: number, row: number) => void;
    onDragEnd?: (e: React.DragEvent) => void;
    onTileClick?: (col: number, row: number) => void;
}

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

const Board: React.FC<BoardProps> = ({
    boardTiles,
    immutableBoardTiles,
    // specialTiles,
    isInteractive = true, // Default to interactive
    onDragOver,
    onDrop,
    onDragStart,
    onDragEnd,
    onTileClick,
}) => {
    return (
        <div
            id="game-board"
            style={{
                gridTemplateColumns: "repeat(15, 1fr)",
                gridTemplateRows: "repeat(15, 1fr)",
            }}
        >
            {[...Array(15)].map((_, row) =>
                [...Array(15)].map((_, col) => {
                    const key = `${col}-${row}`;
                    const tileClass = specialTiles[key];
                    const isImmutable = immutableBoardTiles[key] !== undefined;
                    return (
                        <div
                            key={key}
                            id={`tile-${col}-${row}`}
                            data-coordinates={`(${col},${row})`}
                            className={tileClass}
                            onDragOver={isInteractive ? onDragOver : undefined}
                            onDrop={isInteractive ? (e) => onDrop?.(e, col, row) : undefined}
                            title={tileClass}
                            onClick = { 
                                isInteractive && !isImmutable && onTileClick 
                                ? () => onTileClick(col, row)
                                : undefined
                            }
                        >
                            {boardTiles[key] && (
                                <Image
                                    src={boardTiles[key] || "/letters/empty tile 70.jpg"}
                                    alt={`Tile at ${col}-${row}`}
                                    className={`board-tiles ${
                                        isImmutable ? "immutable-tile" : ""
                                    }`}
                                    width={100}
                                    height={100}
                                    draggable={isInteractive && !isImmutable} // Disable dragging for immutable tiles
                                    onDragStart={
                                        isInteractive
                                            ? (e) => onDragStart?.(e, col, row)
                                            : undefined
                                    }
                                    onDragEnd={isInteractive ? onDragEnd : undefined}
                                />
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Board;