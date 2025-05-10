import React from "react";
import "./LoadingSpinner.css"; // Import the CSS file for the animation

interface LoadingSpinnerProps {
    message?: string; // Optional message to display below the spinner
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
    return (
        <div className="loading-spinner">
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

export default LoadingSpinner;