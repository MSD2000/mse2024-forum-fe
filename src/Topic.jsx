import React from 'react';
import { Link } from 'react-router-dom';

const Topic = ({ topic }) => {
  const { topicID, title, created } = topic.topic;
  const { userNames } =  topic.user;

  function getFirstSentence(text) {
    // Regular expression to match the first sentence
    const firstSentenceMatch = text.match(/[^.!?]*[.!?]/);
    if (firstSentenceMatch) {
        return firstSentenceMatch[0] + '..';
    }
    // If no sentence-ending punctuation is found, return the original string followed by "..."
    return text + '...';
  }

  let summary = getFirstSentence(topic.topic.description);

  return (
    <div className="card mb-3" key={topic.topic.topicID}>
      <div className='card-header'>
        <h5 className="card-title">{topic.topic.title}</h5>
        <p className="card-text">Created by: {topic.user.userNames} | {new Date(topic.topic.created).toLocaleString()} | {topic.topic.views} view(s)</p>
      </div>
      <div className="card-body">
        <p className="card-text">Summary: {summary}</p>
      </div>
      <div className="card-footer">
        <Link to={`/topic-details/${topicID}`} className="btn btn-sm btn-primary me-5">Read full topic</Link>
      </div>
    </div>
  );
};

export default Topic;
