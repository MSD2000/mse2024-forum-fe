import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Topics from './Topics';
import LogIn from './LogIn';
import Register from './Register';
import TopicDetails from './TopicDetails';
import NewTopic from './NewTopic';
import AdminPanel from './AdminPanel';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Topics />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/new-topic" element={<NewTopic />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/topic-details/:id" element={<TopicDetails />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;