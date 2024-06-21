import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleLogout = () => {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const username = getCookie('user');
      if (username) {
        try {
          const response = await fetch(`http://localhost:7211/users/${username}`);
          if (response.ok) {
            const data = await response.json();
            setUser(username);
            setUserRole(data.role);  // Assuming the API response contains a field 'role'
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow shadow-sm mb-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MSD Forum</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/topics">Topics</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/new-topic">New Topic</Link>
                </li>

                {userRole === 'Administrator' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-panel">Admin Panel</Link>
                  </li>
                )}

                <li className="ms-5">
                  <a className='nav-link'>Welcome back, {user}</a>
                </li>

                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Log Out</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Log In</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
