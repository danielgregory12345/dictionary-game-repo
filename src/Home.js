import React from "react";

import NavButton from "./utils/NavButton";
import './App.css'

const Home = () => {
  

  return (
    <div className="popup-overlay">
              <div className="popup-card">
                <h2>Welcome!</h2>
                <div>
                   <NavButton to="/word-of-the-day" label="Word of the Day" /> 
                </div>
                
                <NavButton to="/free-play" label="Free Play" />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    
                </div>
                
              </div>
            </div>
  );
};

export default Home;
