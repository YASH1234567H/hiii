import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import './Profile.css';

function Profile() {
  const [username, setUsername] = useState('');
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.displayName) {
      setUsername(user.displayName);
    } else {
      setUsername('Guest');
    }

    if (user && user.displayName) {
      const detailsRef = ref(database, 'studentDetails/' + user.displayName);
      get(detailsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setDetails(snapshot.val());
          } else {
            setDetails(null);
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
          setDetails(null);
        });
    }
  }, []);

  const handleAddDetails = () => {
    navigate('/adddetails');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Hello, {username}</h1>
      <button onClick={handleAddDetails} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
        Add Details
      </button>
      {details ? (
        <div className="details-container">
          <h2>Your Details:</h2>
          <p><strong>First Name:</strong> {details.firstName}</p>
          <p><strong>Last Name:</strong> {details.lastName}</p>
          <p><strong>Email:</strong> {details.email}</p>
          <p><strong>Contact:</strong> {details.contact}</p>
          <p><strong>Gender:</strong> {details.gender}</p>
          <p><strong>Course:</strong> {details.course}</p>
          <p><strong>State:</strong> {details.state}</p>
          <p><strong>City:</strong> {details.city}</p>
          <p><strong>Pincode:</strong> {details.pincode}</p>
        </div>
      ) : (
        <p style={{ marginTop: '20px' }}>No details found. Please add your details.</p>
      )}
    </div>
  );
}

export default Profile;
