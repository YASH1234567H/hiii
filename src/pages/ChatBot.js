import React, { useState, useEffect, useRef } from 'react';
import { firestore, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatWindowRef = useRef(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(firestore, 'chats', user.uid, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedMessages = [];
      querySnapshot.forEach((doc) => {
        loadedMessages.push(doc.data());
      });
      setMessages(loadedMessages);
      // Scroll to bottom on new messages
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage = {
      sender: 'user',
      text: input.trim(),
      createdAt: serverTimestamp(),
    };

    try {
      const messagesRef = collection(firestore, 'chats', user.uid, 'messages');
      await addDoc(messagesRef, userMessage);

      // Basic bot response logic: echo user message with a delay
      setTimeout(async () => {
        const botMessage = {
          sender: 'bot',
          text: `You said: "${input.trim()}"`,
          createdAt: serverTimestamp(),
        };
        await addDoc(messagesRef, botMessage);
      }, 1000);
    } catch (error) {
      console.error('Error sending message: ', error);
    }

    setInput('');
  };

  return (
    <div style={styles.container}>
      <h1>ChatBot</h1>
      <div style={styles.chatWindow} ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#ECECEC',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
          disabled={!user}
        />
        <button type="submit" style={styles.button} disabled={!user}>Send</button>
      </form>
      {!user && <p style={{ color: 'red' }}>Please log in to use the chat.</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  },
  chatWindow: {
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 10,
    height: 400,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    backgroundColor: '#f9f9f9',
  },
  message: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  form: {
    marginTop: 10,
    display: 'flex',
    gap: 10,
  },
  input: {
    flexGrow: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: 16,
    borderRadius: 5,
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default ChatBot;
