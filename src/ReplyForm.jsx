// ReplyForm.jsx
import React, { useState } from 'react';

const ReplyForm = ({ topicID, onReplySubmit }) => {
  const [replyText, setReplyText] = useState('');

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const username = getCookie('user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    
    const reply = {
      description: replyText,
      topicId: topicID,
      username: username,
      created: today.toISOString(),
      modified: today.toISOString()

    };
    const postResponse = await fetch('http://localhost:8080/replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reply)
    });
    if (postResponse.ok) {
      console.log('Reply added successfully');
      setReplyText('');
      onReplySubmit(); // Trigger the callback to fetch latest replies
    } else {
      console.error('Failed to add reply');
    }

  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="replyText" className="form-label">Your Reply:</label>
          <textarea
            className="form-control"
            id="replyText"
            rows="3"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Reply</button>
      </form>
    </div>
  );
};

export default ReplyForm;
