import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="page-container">
      <h1>Profile</h1>
      {user && (
        <div className="card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p>Avatar uploads coming soon!</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
