import React from "react";

const Card = ({ name, image }) => {
  return <img className="Card" alt={name} src={image} />;
};

export default Card;
