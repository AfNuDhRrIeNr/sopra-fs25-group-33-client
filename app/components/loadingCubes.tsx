import React from "react";
import "./loadingCubes.css"; // Import the CSS file for the animation

interface LoadingCubesProps {
  message?: string; // Optional message to display below the cubes
}

const LoadingCubes: React.FC<LoadingCubesProps> = (
  { message = "Loading..." },
) => {
  return (
    <div className="loading-cubes">
      <div className="cubes">
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingCubes;
