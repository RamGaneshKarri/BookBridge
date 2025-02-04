import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, onValue, set, push } from "firebase/database";
import { database } from "../firebase";
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secure-key"; // Use a strong, secure key

const ChatRoom = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { buyer, seller } = state;
    const [chatID, setChatID] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const encryptMessage = (message) => {
        return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
    };

    const decryptMessage = (encryptedMessage) => {
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    useEffect(() => {
        const generatedChatID = `${buyer}_${seller}`;
        const reverseChatID = `${seller}_${buyer}`;

        const chatRef = ref(database, `chats`);
        onValue(chatRef, (snapshot) => {
            const chatData = snapshot.val();
            if (chatData && (chatData[generatedChatID] || chatData[reverseChatID])) {
                setChatID(chatData[generatedChatID] ? generatedChatID : reverseChatID);
            } else {
                set(ref(database, `chats/${generatedChatID}`), {
                    messages: [],
                });
                setChatID(generatedChatID);
            }
        });
    }, [buyer, seller]);

    useEffect(() => {
        if (!chatID) return;

        const chatMessagesRef = ref(database, `chats/${chatID}/messages`);
        onValue(chatMessagesRef, (snapshot) => {
            const chatMessages = snapshot.val();
            const decryptedMessages = chatMessages
                ? Object.values(chatMessages).map((msg) => ({
                    ...msg,
                    message: decryptMessage(msg.message),
                }))
                : [];
            setMessages(decryptedMessages);
        });
    }, [chatID]);

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        const encryptedMessage = encryptMessage(newMessage);

        const chatMessagesRef = ref(database, `chats/${chatID}/messages`);
        push(chatMessagesRef, {
            sender: buyer,
            message: encryptedMessage,
            timestamp: new Date().toISOString(),
        });

        const notificationRef = ref(database, `notifications/${seller}`);
        push(notificationRef, {
            buyerID: buyer,
            buyerName: "Buyer's Name",
            message: newMessage, // Notifications can show the original text
            timestamp: new Date().toISOString(),
        });

        setNewMessage("");
    };

    const groupMessagesByDate = (messages) => {
        const groupedMessages = {};
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        messages.forEach((msg) => {
            const msgDate = new Date(msg.timestamp);
            const msgDateString = msgDate.toDateString();

            if (msgDateString === today.toDateString()) {
                groupedMessages["Today"] = groupedMessages["Today"] || [];
                groupedMessages["Today"].push(msg);
            } else if (msgDateString === yesterday.toDateString()) {
                groupedMessages["Yesterday"] = groupedMessages["Yesterday"] || [];
                groupedMessages["Yesterday"].push(msg);
            } else {
                groupedMessages[msgDateString] = groupedMessages[msgDateString] || [];
                groupedMessages[msgDateString].push(msg);
            }
        });

        return groupedMessages;
    };

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <div className="container-fluid p-0" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <nav className="navbar navbar-light bg-light shadow-sm">
                <div className="container">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <span className="navbar-brand mb-0 h1">Chat with {seller}</span>
                    <div className="d-flex align-items-center">
                        <i
                            className="bi bi-person-circle"
                            style={{ fontSize: "1.5rem", cursor: "pointer" }}
                            onClick={() => navigate("/profile")}
                        ></i>
                    </div>
                </div>
            </nav>

            <div className="chat-container bg-light p-3" style={{ height: "calc(100vh - 60px)", overflow: "hidden" }}>
                <div
                    className="chat-box bg-white shadow-sm rounded mb-3"
                    style={{ height: "75%", overflowY: "auto", padding: "10px" }}
                >
                    {Object.keys(groupedMessages).length === 0 ? (
                        <p className="text-center text-muted">No messages yet. Start the conversation!</p>
                    ) : (
                        Object.entries(groupedMessages).map(([date, messages]) => (
                            <div key={date}>
                                <p className="text-center text-muted">
                                    <strong>{date}</strong>
                                </p>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`d-flex ${msg.sender === buyer ? "justify-content-end" : "justify-content-start"} mb-3`}
                                    >
                                        <div
                                            className={`p-3 rounded shadow-sm ${msg.sender === buyer ? "bg-primary text-white" : "bg-secondary text-white"}`}
                                            style={{ maxWidth: "70%" }}
                                        >
                                            <p className="mb-1">{msg.message}</p>
                                            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                    <button className="btn btn-primary" onClick={handleSendMessage}>
                        <i className="bi bi-send"></i> Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
