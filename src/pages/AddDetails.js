import React, { useState } from 'react';
import './AddDetails.css'; // Import the CSS file for styling
import { database, auth } from '../firebase';
import { ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

function AddDetails() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    gender: '',
    course: '',
    state: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.contact) newErrors.contact = 'Contact number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.course) newErrors.course = 'Course selection is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Override email with authenticated user's email
        const user = auth.currentUser;
        const userEmail = user ? user.email : formData.email;
        const detailsToSave = { ...formData, email: userEmail };
        if (!user) {
          alert('User not authenticated. Please login first.');
          return;
        }
        if (!user.displayName) {
          alert('User display name not set. Cannot save details.');
          return;
        }
        // Use user displayName as key to save details uniquely
        const detailsRef = ref(database, 'studentDetails/' + user.displayName);
        await set(detailsRef, detailsToSave);
        alert('Form submitted successfully!');
        const submittedData = { ...detailsToSave };
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          contact: '',
          gender: '',
          course: '',
          state: '',
          city: '',
          pincode: '',
        });
        setErrors({});
        navigate('/profile', { state: { details: submittedData } });
      } catch (error) {
        alert('Failed to submit form: ' + error.message);
      }
    }
  };

  return (
    <div className="form-container">
      <h1>Student Details Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name*</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>
        <div>
          <label>Last Name*</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p>{errors.lastName}</p>}
        </div>
        <div>
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div>
          <label>Contact Number*</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
          {errors.contact && <p>{errors.contact}</p>}
        </div>
        <div>
          <label>Gender*</label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={formData.gender === 'Male'}
            onChange={handleChange}
          />
          Male
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={formData.gender === 'Female'}
            onChange={handleChange}
          />
          Female
          {errors.gender && <p>{errors.gender}</p>}
        </div>
        <div>
          <label>Course*</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
          >
            <option value="">Select Course</option>
            <option value="CSE">Computer Science and Engineering</option>
            <option value="ECE">Electronics and Communication Engineering</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
            <option value="EEE">Electrical and Electronics Engineering</option>
          </select>
          {errors.course && <p>{errors.course}</p>}
        </div>
        <div>
          <label>State*</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
          {errors.state && <p>{errors.state}</p>}
        </div>
        <div>
          <label>City*</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <p>{errors.city}</p>}
        </div>
        <div>
          <label>Pincode*</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
          {errors.pincode && <p>{errors.pincode}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddDetails;
