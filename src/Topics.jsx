import React, { useState, useEffect } from 'react';
import Topic from './Topic';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Define the page size here

  useEffect(() => {
    fetchTopics(currentPage);
  }, [currentPage]);

  const fetchTopics = async (page) => {
    try {
      const response = await fetch(`http://localhost:7211/topics?page=${page}&pageSize=${pageSize}`);
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      } else {
        console.error('Failed to fetch topics');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className='w-50 m-3'>
      <div>
        {topics.map((topic) => (
          <Topic key={topic.topic.topicID} topic={topic} />
        ))}
      </div>
      <div className='mt-3 d-flex justify-content-between'>
        <button className='btn btn-primary' onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button className='btn btn-primary' onClick={handleNextPage} disabled={topics.length < pageSize}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Topics;
