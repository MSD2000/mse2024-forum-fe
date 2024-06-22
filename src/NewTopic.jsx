import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewTopic = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const username = getCookie('user');

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = 0;
    const views = 0;
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const created = today.toISOString();
    const modified = today.toISOString();

    const newTopic = {
      id,
      title,
      description,
      views,
      username,
      created,
      modified
    };

    console.log(JSON.stringify(newTopic));

    try {
      const response = await fetch('http://localhost:8080/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTopic)
      });

      if (response.ok) {
        // Topic created successfully
        navigate('/topics');
      } else {
        // Handle error
        console.error('Failed to create topic');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Topic</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Topic</button>
      </form>
    </div>
  );
};

export default NewTopic;