import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import LoginSignup from './pages/LoginSignup';
import News from './pages/News';
import AddNews from './pages/AddNews';
import Profile from './pages/Profile';
import AddDetails from './pages/AddDetails';
import ChatBot from './pages/ChatBot';
import AdminChat from './Admin/AdminChat';

function PrivateRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ user, children }) {
  // Simple admin check: replace with your own logic
  const adminEmails = ['admin@example.com'];
  if (!user || !adminEmails.includes(user.email)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="App">
      <video autoPlay muted loop className="background-video">
        <source src="https://videos.pexels.com/video-files/2002527/2002527-hd_1920_1080_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <nav className="navbar">
        <ul>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: 'auto' }}>
            {user ? (
              <>
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                  {user.displayName ? `Hello, ${user.displayName}` : 'Hello, User'}
                </span>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgb(212, 17, 17)', cursor: 'pointer', fontWeight: 'bold' }}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" activeclassname="active">
                Login/Signup
              </NavLink>
            )}
          </li>
          <li>
            <NavLink to="/" end activeclassname="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/aboutus" activeclassname="active">
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/contactus" activeclassname="active">
              Contact Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/news" activeclassname="active">
              News
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink to="/profile" activeclassname="active">
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/chatbot" activeclassname="active">
                  ChatBot
                </NavLink>
              </li>
              {user && ['admin@example.com'].includes(user.email) && (
                <li>
                  <NavLink to="/adminchat" activeclassname="active">
                    Admin Chat
                  </NavLink>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={
            <PrivateRoute user={user}>
              <ContactUs user={user} />
            </PrivateRoute>
          } />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/news" element={<News user={user} />} />
          <Route path="/addnews" element={
            <PrivateRoute user={user}>
              <AddNews />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute user={user}>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/adddetails" element={
            <PrivateRoute user={user}>
              <AddDetails />
            </PrivateRoute>
          } />
          <Route path="/chatbot" element={
            <PrivateRoute user={user}>
              <ChatBot />
            </PrivateRoute>
          } />
          <Route path="/adminchat" element={
            <AdminRoute user={user}>
              <AdminChat />
            </AdminRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
