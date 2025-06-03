import React, { useState, useEffect, useRef } from 'react';
import { firestore } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatWindowRef = useRef(null);

  // Load all users who have chat messages
  useEffect(() => {
    const chatsRef = collection(firestore, 'chats');
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      const userIds = [];
      snapshot.forEach(doc => {
        userIds.push(doc.id);
      });
      setUsers(userIds);
      if (!selectedUserId && userIds.length > 0) {
        setSelectedUserId(userIds[0]);
      }
    });
    return () => unsubscribe();
  }, [selectedUserId]);

  // Load messages for selected user
  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }
    const messagesRef = collection(firestore, 'chats', selectedUserId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedMessages = [];
      querySnapshot.forEach(doc => {
        loadedMessages.push(doc.data());
      });
      setMessages(loadedMessages);
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    });
    return () => unsubscribe();
  }, [selectedUserId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUserId) return;

    const adminMessage = {
      sender: 'admin',
      text: input.trim(),
      createdAt: serverTimestamp(),
    };

    try {
      const messagesRef = collection(firestore, 'chats', selectedUserId, 'messages');
      await addDoc(messagesRef, adminMessage);
    } catch (error) {
      console.error('Error sending admin message: ', error);
    }

    setInput('');
  };

  return (
    <div style={styles.container}>
      <h1>Admin Chat Box</h1>
      <div style={styles.content}>
        <div style={styles.userList}>
          <h3>Users</h3>
          {users.length === 0 && <p>No users with chats.</p>}
          <ul style={styles.userUl}>
            {users.map(userId => (
              <li
                key={userId}
                style={{
                  ...styles.userItem,
                  backgroundColor: userId === selectedUserId ? '#007bff' : 'transparent',
                  color: userId === selectedUserId ? 'white' : 'black',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedUserId(userId)}
              >
                {userId}
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.chatArea}>
          <div style={styles.chatWindow} ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'admin' ? '#FFD700' : (msg.sender === 'user' ? '#DCF8C6' : '#ECECEC'),
                }}
              >
                <strong>{msg.sender === 'admin' ? 'Admin' : 'User'}:</strong> {msg.text}
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
            />
            <button type="submit" style={styles.button}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 900,
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    display: 'flex',
    gap: 20,
  },
  userList: {
    width: 200,
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 10,
    height: 400,
    overflowY: 'auto',
  },
  userUl: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  userItem: {
    padding: 10,
    borderRadius: 5,
  },
  chatArea: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatWindow: {
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 10,
    height: 350,
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

export default AdminChat;
