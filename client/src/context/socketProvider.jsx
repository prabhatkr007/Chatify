import React, { useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create a context for the socket
const SocketContext = React.createContext(null);

// Custom hook to use the socket context
export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

// SocketProvider component to provide socket context to its children
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(); 
  const [messages, setMessages] = useState([]); 

  const sendMessage = useCallback((msg) => {
    console.log("Send Message", msg);

    if (socket) {
      socket.emit("event:message", { message: msg }); 
    }
  }, [socket]);


  const onMessageRec = useCallback((msg) => {
    console.log("From Server Msg Rec", msg);

    const { message } = JSON.parse(msg); 
    setMessages((prev) => [...prev, message]); 
  }, []);

  // useEffect to initialize the socket connection
  useEffect(() => {
    const _socket = io("http://localhost:8000"); 
    _socket.on("message", onMessageRec); 

    setSocket(_socket); // Set the socket instance to state

    // Cleanup function to remove event listener and disconnect socket on component unmount
    return () => {
      _socket.off("message", onMessageRec);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, [onMessageRec]);

  return (
    // Provide the sendMessage function and messages state to children components
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
