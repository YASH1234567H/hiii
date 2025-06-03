import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

function News({ user }) {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newsRef = ref(database, 'news');
    const unsubscribe = onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newsList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        // Sort news by date descending
        newsList.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNewsItems(newsList);
      } else {
        setNewsItems([]);
      }
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNewsClick = () => {
    navigate('/addnews');
  };

  if (loading) {
    return <div>Loading news...</div>;
  }

  if (error) {
    return <div>Error loading news: {error}</div>;
  }

  return (
    <div style={{ position: 'relative', minHeight: '80vh', paddingBottom: '60px' }}>
      <h1>News Page</h1>
      {newsItems.length === 0 ? (
        <p>No news available.</p>
      ) : (
        <ul>
          {newsItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px', fontSize: '18px' }}>
              <strong>{item.title}</strong><br />
              <span>{item.description}</span><br />
              <small>{new Date(item.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={handleAddNewsClick}
        disabled={!user}
        title={!user ? "Please login to add news" : ""}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: user ? 'pointer' : 'not-allowed',
          opacity: user ? 1 : 0.5
        }}
      >
        Add News
      </button>
    </div>
  );
}

export default News;
