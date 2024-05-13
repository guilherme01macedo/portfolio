import React from 'react';
import './Card.scss';

const Card = ({ title }) => {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
    </div>
  );
}

export default Card;
