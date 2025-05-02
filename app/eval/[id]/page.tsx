"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import React, { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
//import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import FriendRequests from "@/components/FriendRequests";
import "../modal.css"; 
import "../eval.css"; 



const Eval: React.FC = () => {
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const apiService = useApi();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isPendingRequestsModalOpen, setIsPendingRequestsModalOpen] = useState(false);
  
  
  interface Game {
    gameId: number;
    users: User[];
    host: User;
    gameStatus: string; // CREATED, ONGOING, TERMINATED
  }

  interface User {
    token: string;
    id: number;
    username: string;
    highScore: number;
    friends: string[];
}

interface FriendRequest {
  id: number;
  sender: User;
  status: string; // PENDING, ACCEPTED, DECLINED
}

interface Friend {
  username: string;
}

useEffect(() => {
        if (!token) return; // Skip polling if token is not available
        const fetchUpdates = () => {
            apiService.get<FriendRequest[]>(`/users/friendRequests`)
                .then((data) => {
                    // Filter only PENDING friend requests
                    const pending = data.filter((request) => request.status === "PENDING");
                    setPendingRequests(pending);
                })
                .catch((error) => console.error('Error fetching friend requests:', error));
            
            apiService.get<User[]>(`/users?userId=${userId}`)
                .then((data) => {
                    const user = (data[0] || {}) as User;
                    const friendsList = (user.friends || []).map((username) => ({
                        username: username, // Map the username to the Friend interface
                    }));
                    setFriends(friendsList); // Update the friends state
                })
                .catch((error) => console.error('Error fetching friends:', error));
        };

        fetchUpdates(); // Initial fetch
        const intervalId = setInterval(fetchUpdates, 5000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [apiService, userId, token]);


    const handleFriendRequest = (requestId: number, action: 'accept' | 'decline') => {
      const status = action === 'accept' ? 'ACCEPTED' : 'DECLINED';
      
      // Optimistically update the UI by removing the request from the pending list
      const updatedPendingRequests = pendingRequests.filter((req) => req.id !== requestId);
      setPendingRequests(updatedPendingRequests);

      apiService.put<string>(
          `/users/friendRequests/${requestId}`,
          { "status": status }
      )
          .then(() => {
              if (action === 'accept') {
                  const acceptedRequest = pendingRequests.find((req) => req.id === requestId);
                  if (acceptedRequest) {
                      setFriends([...friends, { username: acceptedRequest?.sender.username }]); // Add to friends list
                  }
              }
          })
          .catch((error) => {
              console.error(`Error handling friend request (${action}):`, error);
              alert(`Failed to ${action} the friend request`);
              // Revert optimistic update in case of an error
              setPendingRequests([...pendingRequests, pendingRequests.find((req) => req.id === requestId)!]);
          });
  };

  useEffect(()=> {
      setUsername(localStorage.getItem("username"));
      setToken(localStorage.getItem("token"));
      setUserId(localStorage.getItem("userId"));
  }, []);

  const handleFriendAdded = (friend: User) => {
    setFriends([...friends, friend]);
  };

  const handleButtonClick = () => {
    router.push("/dashboard");
  };

  return (
    <div>

      <header>
        <button 
            className="nav_button"
            onClick={handleButtonClick}
            style={{ backgroundColor: '#D04949', left: 0, marginLeft: '1vw' }}
        >
            Back
        </button>
        <div className="Title">ScrabbleNow</div>
        <div className="userSnippet">
            <span className="username">{username}</span>
            <FriendRequests 
                onFriendAdded={handleFriendAdded} 
            />
        </div>
      </header>

      <main>
        
      {isPendingRequestsModalOpen && (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Pending Friend Requests</h2>
                {pendingRequests.length > 0 ? (
                   <ul>
                       {pendingRequests.map((request) => (
                           <li key={request.id} className='friend-request-row'>
                               <img 
                               src="/User_Icon.jpg" 
                               alt="User Icon"
                               className='modal-avatar'
                               />
                               <span className='friend-username'>{request.sender.username}</span>
                               <div className='modal-buttons'>
                               <button className='modal-button-green' onClick={() => handleFriendRequest(request.id, 'accept')}>
                                   Accept
                               </button>
                                  <button className='modal-button-red' onClick={() => handleFriendRequest(request.id, 'decline')}>
                                      Decline
                                  </button>
                              </div>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p>No pending friend requests.</p>
                  )}
                  <button className='modal-button-gold' onClick={() => setIsPendingRequestsModalOpen(false)}>Close</button>
             </div>
       </div>
      )}
      </main>
    </div>
    
    )
  }

export default Eval;
