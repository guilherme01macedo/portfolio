import React from 'react';
import './Card.scss';

const Card = ({ title, isSelected, className }) => {
  return (
    <div className={ isSelected ? `card__container card__selected-container `  + className: `card__container ` + className}>
        {isSelected ? <h3>{title}</h3>:<h4>{title}</h4>}
    </div>
  );
}

export default Card;
