import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

function AddNews() {
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDescription, setNewsDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newsRef = ref(database, 'news');
      await push(newsRef, {
        title: newsTitle,
        description: newsDescription,
        date: new Date().toISOString()
      });
      alert(`News added:\nTitle: ${newsTitle}\nDescription: ${newsDescription}`);
      setNewsTitle('');
      setNewsDescription('');
    } catch (error) {
      alert('Failed to add news: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Add News</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newsTitle">Title:</label><br />
          <input
            type="text"
            id="newsTitle"
            value={newsTitle}
            onChange={(e) => setNewsTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newsDescription">Description:</label><br />
          <textarea
            id="newsDescription"
            value={newsDescription}
            onChange={(e) => setNewsDescription(e.target.value)}
            required
            rows="5"
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Add News</button>
      </form>
    </div>
  );
}

export default AddNews;
