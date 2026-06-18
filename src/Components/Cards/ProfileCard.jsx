import React from 'react';

function ProfileCard({ name, bio, imageUrl }) {
  return (
    <div className="card shadow-sm p-3 border-secondary border-3 text-center">
      <img
        src={imageUrl || "https://i.pinimg.com/736x/30/a1/d5/30a1d599257c472341803f13a8d87a94.jpg"}
        alt="Profile"
        className="rounded-circle mx-auto mb-3"
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
      />
      <h4 className="card-title text-secondary">{name || "Virat Kohli"}</h4>
      <p className="card-text text-muted">{bio || "Indian Cricketer"}</p>
      <button className="btn btn-outline-secondary btn-sm mt-2">Follow</button>
    </div>
  );
}

export default ProfileCard;
