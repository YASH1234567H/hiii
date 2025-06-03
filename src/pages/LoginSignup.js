import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let timer;
    if (showVideo) {
      timer = setTimeout(() => {
        handleVideoEnded();
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer);
  }, [showVideo]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      setLoginData({ email: '', password: '' });
      setShowVideo(true);
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
      await updateProfile(userCredential.user, { displayName: signupData.name });
      setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
      // Redirect to login page after successful signup
      window.location.href = '/login';
    } catch (error) {
      alert(`Signup failed: ${error.message}`);
    }
  };

  const handleVideoEnded = () => {
    window.location.href = '/';
  };

  if (showVideo) {
    return (
      <div>
        <video
          src="https://cdn.pixabay.com/video/2017/12/05/13232-246463976_large.mp4"
          autoPlay
          controls={false}
          onEnded={handleVideoEnded}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            margin: 0,
            padding: 0,
            zIndex: 9999
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Signup'} Page</h1>
      <div>
        <button onClick={() => setIsLogin(true)} disabled={isLogin}>Login</button>
        <button onClick={() => setIsLogin(false)} disabled={!isLogin}>Signup</button>
      </div>
      {isLogin ? (
        <form onSubmit={handleLoginSubmit}>
          <div>
            <label htmlFor="loginEmail">Email:</label><br />
            <input
              type="email"
              id="loginEmail"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
          </div>
          <div>
            <label htmlFor="loginPassword">Password:</label><br />
            <input
              type="password"
              id="loginPassword"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>Login</button>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit}>
          <div>
            <label htmlFor="signupName">Name:</label><br />
            <input
              type="text"
              id="signupName"
              name="name"
              value={signupData.name}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signupEmail">Email:</label><br />
            <input
              type="email"
              id="signupEmail"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signupPassword">Password:</label><br />
            <input
              type="password"
              id="signupPassword"
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signupConfirmPassword">Confirm Password:</label><br />
            <input
              type="password"
              id="signupConfirmPassword"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>Signup</button>
        </form>
      )}
    </div>
  );
}

export default LoginSignup;
