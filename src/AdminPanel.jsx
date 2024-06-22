import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(1);
  const [userRole, setUserRole] = useState('');
  const [user, setUser] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const fetchUsers = async (page, pageSize) => {
    try {
      const response = await fetch(`http://localhost:8080/users?page=${page}&pageSize=${pageSize}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRoleChange = (index, role) => {
    const updatedUsers = [...users];
    updatedUsers[index].role = role;
    setUsers(updatedUsers);
  };

  const handleSave = async (index) => {
    const userToUpdate = users[index];
    try {
      const response = await fetch(`http://localhost:8080/users/${userToUpdate.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userToUpdate)
      });
      if (response.ok) {
        console.log('User role updated successfully');
      } else {
        console.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const username = getCookie('user');
      if (username) {
        try {
          const response = await fetch(`http://localhost:8080/users/${username}`);
          if (response.ok) {
            const data = await response.json();
            setUser(username);
            setUserRole(data.role);
            if (data.role !== 'Administrator') {
              navigate('/'); // Redirect if not an administrator
            }
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        navigate('/login'); // Redirect to login if not logged in
      }
    };

    fetchUserData();
    fetchUsers(page, pageSize);
  }, [page, pageSize, navigate]);

  if (!user || userRole !== 'Administrator') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userID}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.userNames}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                  className="form-select"
                >
                  <option value="User">User</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </td>
              <td>
                <button className="btn btn-primary" onClick={() => handleSave(index)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="btn btn-primary"
          onClick={() => setPage((prevPage) => prevPage + 1)}
          disabled={users.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
