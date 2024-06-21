import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReplyForm from './ReplyForm';

const TopicDetails = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTopic, setEditingTopic] = useState(false);
  const [editTopicText, setEditTopicText] = useState('');
  const [editingReply, setEditingReply] = useState(null);
  const [editText, setEditText] = useState('');
  const pageSize = 2;

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`http://localhost:7211/topics/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTopic(data);
          setEditTopicText(data.topic.description);
          await fetch(`http://localhost:7211/topics/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...data.topic,
              views: data.topic.views + 1
            })
          });
        } else {
          console.error('Failed to fetch topic');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchReplies = async (page) => {
      try {
        const response = await fetch(`http://localhost:7211/replies/${id}?page=${page}&pageSize=${pageSize}`);
        if (response.ok) {
          const data = await response.json();
          setReplies(data);
        } else {
          console.error('Failed to fetch replies');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (id) {
      fetchTopic();
      fetchReplies(currentPage);
    }

    const getUser = async () => {
      const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
      if (userCookie) {
        const username = userCookie.split('=')[1];
        try {
          const response = await fetch(`http://localhost:7211/users/${username}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
            setIsLoggedIn(true);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    getUser();
  }, [id, currentPage]);

  const handleDeleteReply = async (replyID) => {
    try {
      const response = await fetch(`http://localhost:7211/replies/${replyID}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setReplies((prevReplies) => prevReplies.filter(reply => reply.reply.replyID !== replyID));
      } else {
        console.error('Failed to delete reply');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditReply = (reply) => {
    setEditingReply(reply.reply.replyID);
    setEditText(reply.reply.description);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:7211/replies/${editingReply}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: editText,
          topicID: id,
          userID: currentUser.userID,
          replyID: editingReply,
          created: replies.find(reply => reply.reply.replyID === editingReply).reply.created,
          modified: new Date().toISOString()
        })
      });
      if (response.ok) {
        setReplies((prevReplies) => prevReplies.map(reply => 
          reply.reply.replyID === editingReply ? { ...reply, reply: { ...reply.reply, description: editText } } : reply
        ));
        setEditingReply(null);
        setEditText('');
      } else {
        console.error('Failed to edit reply');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingReply(null);
    setEditText('');
  };

  const handleEditTopic = () => {
    setEditingTopic(true);
  };

  const handleEditTopicSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:7211/topics/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...topic.topic,
          description: editTopicText,
          modified: new Date().toISOString()
        })
      });
      if (response.ok) {
        setTopic((prevTopic) => ({
          ...prevTopic,
          topic: {
            ...prevTopic.topic,
            description: editTopicText
          }
        }));
        setEditingTopic(false);
      } else {
        console.error('Failed to edit topic');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelEditTopic = () => {
    setEditingTopic(false);
    setEditTopicText(topic.topic.description);
  };

  const handleDeleteTopic = async () => {
    try {
      const response = await fetch(`http://localhost:7211/topics/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        document.location.href = '/topics' // Redirect to home page or topics list after deletion
      } else {
        console.error('Failed to delete topic');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchReplies = async (page) => {
    try {
      const response = await fetch(`http://localhost:7211/replies/${id}?page=${page}&pageSize=${pageSize}`);
      if (response.ok) {
        const data = await response.json();
        setReplies(data);
      } else {
        console.error('Failed to fetch replies');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReplySubmit = () => {
    fetchReplies(currentPage);
  };

  if (id && !topic) {
    return <div>Loading...</div>;
  }

  const userCanEditDelete = (authorID) => {
    return currentUser && (currentUser.role === 'Moderator' || currentUser.role === 'Administrator' || currentUser.userID === authorID);
  };

  return (
    <div>
      {topic ? (
        <div className='w-50 m-3'>
          <div className='card mb-3'>
            <div className='card-header'>
              <h2 className="card-title">{topic.topic.title}</h2>
              <p className="card-text">Created by: {topic.user.userNames} | {new Date(topic.topic.created).toLocaleString()} | {topic.topic.views} view(s)</p>
              {userCanEditDelete(topic.topic.userID) && (
                <>
                  <button 
                    onClick={handleEditTopic} 
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={handleDeleteTopic} 
                    className="btn btn-danger btn-sm ms-2"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            <div className='card-body'>
              {editingTopic ? (
                <form onSubmit={handleEditTopicSubmit}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editTopicText}
                      onChange={(e) => setEditTopicText(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" onClick={handleCancelEditTopic} className="btn btn-secondary ms-2">Cancel</button>
                </form>
              ) : (
                <p className="card-text">{topic.topic.description}</p>
              )}
            </div>
          </div>

          <hr/>
          {isLoggedIn && <ReplyForm topicID={id} onReplySubmit={handleReplySubmit} />}
          <hr/>

          {replies.map((reply) => (
            <div key={reply.reply.replyID} className="card mb-3">
              <div className='card-header'>
                <p className="card-text">Replied by: {reply.user.userNames} | {new Date(reply.reply.created).toLocaleString()}</p>
                {userCanEditDelete(reply.reply.userID) && (
                  <>
                    <button 
                      onClick={() => handleEditReply(reply)} 
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteReply(reply.reply.replyID)} 
                      className="btn btn-danger btn-sm ms-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
              <div className="card-body">
                {editingReply === reply.reply.replyID ? (
                  <form onSubmit={handleEditSubmit}>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button type="button" onClick={handleCancelEdit} className="btn btn-secondary ms-2">Cancel</button>
                  </form>
                ) : (
                  <p className="card-text">{reply.reply.description}</p>
                )}
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary me-5"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className='ms-5 me-5'>Page {currentPage}</span>
            <button
              className="btn btn-primary ms-5"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={replies.length < pageSize}
            >
              Next
            </button>
          </div>

        </div>
      ) : (
        <p>No topic found.</p>
      )}
    </div>
  );
};

export default TopicDetails;
