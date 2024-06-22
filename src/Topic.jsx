import React from 'react';
import { Link } from 'react-router-dom';

const Topic = ({ topic }) => {
  const { id, title, description, username, created } = topic;

  function getFirstSentence(text) {
    // Regular expression to match the first sentence
    const firstSentenceMatch = text.match(/[^.!?]*[.!?]/);
    if (firstSentenceMatch) {
        return firstSentenceMatch[0] + '..';
    }
    // If no sentence-ending punctuation is found, return the original string followed by "..."
    return text + '...';
  }

  let summary = getFirstSentence(topic.description);

  return (
    <div className="card mb-3" key={topic.id}>
      <div className='card-header'>
        <h5 className="card-title">{topic.title}</h5>
        <p className="card-text">Created by: {topic.username} | {new Date(topic.created).toLocaleString()} | {topic.views} view(s)</p>
      </div>
      <div className="card-body">
        <p className="card-text">Summary: {summary}</p>
      </div>
      <div className="card-footer">
        <Link to={`/topic-details/${id}`} className="btn btn-sm btn-primary me-5">Read full topic</Link>
      </div>
    </div>
  );
};

export default Topic;
