"use client";

import React, { useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./WebSocketClient.css"; // Import the CSS file

export default function WebSocketClient() {
  const [messages, setMessages] = useState<string[]>([]);
  const [url, setUrl] = useState<string>("http://localhost:8080/connections");
  const [subscribeDestination, setSubscribeDestination] = useState<string>(
    "/topic/game_states/1",
  );
  const [sendDestination, setSendDestination] = useState<string>(
    "/ws/game_states/1",
  );
  const [sendBody, setSendBody] = useState<string>('{"id":1}');
  const stompClientRef = useRef<Client | null>(null);

  const connectWebSocket = () => {
    const socket = new SockJS(url);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");
    };

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  const subscribeToDestination = () => {
    stompClientRef.current?.subscribe(subscribeDestination, (message) => {
      setMessages((prev) => [...prev, `📩 ${message.body}`]);
    });
  };

  const sendMessage = () => {
    stompClientRef.current?.publish({
      destination: sendDestination,
      body: sendBody,
    });
  };

  return (
    <div className="container">
      <h2 className="title">WebSocket STOMP Client (Next.js)</h2>
      <div className="input-group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="WebSocket URL"
          className="input"
        />
        <button onClick={connectWebSocket} className="button connect">
          Connect
        </button>
      </div>
      <div className="input-group">
        <input
          type="text"
          value={subscribeDestination}
          onChange={(e) => setSubscribeDestination(e.target.value)}
          placeholder="Subscribe Destination"
          className="input"
        />
        <button onClick={subscribeToDestination} className="button subscribe">
          Subscribe
        </button>
      </div>
      <div className="input-group">
        <input
          type="text"
          value={sendDestination}
          onChange={(e) => setSendDestination(e.target.value)}
          placeholder="Send Destination"
          className="input"
        />
        <textarea
          value={sendBody}
          onChange={(e) => setSendBody(e.target.value)}
          placeholder="Message Body (JSON)"
          className="textarea"
        />
        <button onClick={sendMessage} className="button send">
          Send Message
        </button>
      </div>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="message">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
