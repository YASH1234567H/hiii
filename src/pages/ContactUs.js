import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, push, get } from 'firebase/database';

function ContactUs({ user }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.displayName) {
        try {
          const detailsRef = ref(database, 'studentDetails/' + user.displayName);
          const snapshot = await get(detailsRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setFormData(prevData => ({
              ...prevData,
              name: data.firstName + ' ' + data.lastName,
              email: data.email
            }));
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contactsRef = ref(database, 'contacts');
      await push(contactsRef, formData);
      alert(`Thank you, ${formData.name}! Your message has been received.`);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      alert('Failed to submit message: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Contact Us Page</h1>
      <div className="marquee">
        toll-free-number-1125846790
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label><br />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label><br />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label><br />
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label><br />
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }} disabled={!user} title={!user ? "Please login to submit" : ""}>Submit</button>
      </form>
    </div>
  );
}

export default ContactUs;
