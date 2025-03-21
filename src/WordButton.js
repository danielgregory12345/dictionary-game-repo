import React from "react";

const WordButton = ({ word, onClick }) => {
  return (
    <button className="word-button"
      style={{  margin: "2px", fontSize: "16px", cursor: "pointer" }} 
      onClick={() => onClick(word)}
    >
      {word}
    </button>
  );
};

export default WordButton;