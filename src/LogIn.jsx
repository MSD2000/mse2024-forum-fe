import React, { useState } from 'react';
import LogInForm from './LogInForm';

const LogIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username) => {
    // Perform actions after successful login
    console.log('Login successful');
    document.cookie = `user=${username}; path=/`;
    // Set isLoggedIn to true to trigger the Redirect component
    setIsLoggedIn(true);
  };

  // Redirect to '/topics' if isLoggedIn is true
  if (isLoggedIn) {
    document.location = "/topics";
  }

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <LogInForm onLogin={handleLogin} />
    </div>
  );
};

export default LogIn;