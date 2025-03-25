'use client';
import React from 'react';

const DashboardPage: React.FC = () => {
    return (
        <div className="dashboard-page">
            <div className="header">Header Placeholder</div>
            <div className="dashboard-container">
                <div className="friends-list">
                    <h2>Friends List</h2>
                    <ul>
                        <li>
                            <img src="/UserIcon.png" alt="User Icon" />
                            Marcus
                        </li>
                        <li>
                            <img src="/UserIcon.png" alt="User Icon" />
                            Monica
                        </li>
                        <li>
                            <img src="/UserIcon.png" alt="User Icon" />
                            Daniel
                        </li>
                        <li>
                            <img src="/UserIcon.png" alt="User Icon" />
                            Marcel
                        </li>
                    </ul>
                    <button className="add-friend-button">Add Friend</button>
                </div>
                <div className="scrabble-now">
                    <h2>ScrabbleNow!</h2>
                    <div className="scrabble-board">
                        <img src="/Board.jpg" alt="Scrabble Board" />
                    </div>
                    <button className="create-game-button">Create Game</button>
                </div>
                <div className="leaderboard">
                    <h2>Leaderboard</h2>
                    <div className="leaderboard-list">
                        <div className="leader">
                            <img src="/Gold.png" alt="Gold Medal" />
                            Monica
                        </div>
                        <div className="leader">
                            <img src="/Silver.png" alt="Silver Medal" />
                            Daniel
                        </div>
                        <div className="leader">
                            <img src="/Bronze.png" alt="Bronze Medal" />
                            Marcel
                        </div>
                    </div>
                    <button className="show-more-button">Show more</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;