import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

import WordButton from "./WordButton";
import logo from './1024px-Merriam-Webster_logo.png';

import './App.css';

function App() {
  const api_url = "https://dictionaryapi.com/api/v3/references/collegiate/json/";
  const api_key = "?key=277f50c5-43d2-45ae-9643-30de29c388f6";
  const timeRef = useRef(null);
  const url = window.location.href;
  const message = "Check this out!";
  // State variables to store word and def
  const [word, setWord] = useState('');
  const [clicks, setClicks] = useState(-1);
  const [partOfSpeech, setpartOfSpeech] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [minutesLabel, setMinutesLabel] = useState('00');
  const [secondsLabel, setSecondsLabel] = useState('00');

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [definitions, setDefinitions] = useState([[], [], []]); // Array for def1, def2, def3

  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  
  
  function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    setIsDarkMode((prevMode) => !prevMode);

  }
  function hasLetters(inputString) {
    // Regular expression to check for letters
    var letterRegex = /[a-zA-Z]/;

    // Test if the input string contains letters
    return letterRegex.test(inputString);
  }
  function trimNonAlphabetical(inputString) {
      // Regular expression to match non-alphabetical characters from the beginning and end
      var nonAlphabeticalRegex = /^[^a-zA-Z]+|[^a-zA-Z]+$/g;

      // Trim non-alphabetical characters from the front and back
      var trimmedString = inputString.replace(nonAlphabeticalRegex, '');

      return trimmedString;
  }
  const endGame = useCallback(() => {
    const saveWinDate = (() =>  {
      const today = new Date().toISOString().split("T")[0]; // Get today's date as YYYY-MM-DD
      localStorage.setItem("lastWinDate", today);
    } )

    saveWinDate()
    setShowPopup(true); // Show the popup when the user wins
  }, [])

  function closePopup() {
    setShowPopup(false);
  }
  function getRandomLetter() {
      // Generate a random index for the alphabet (0 to 25)
      const randomIndex = Math.floor(Math.random() * 26);
      // Convert the random index to a corresponding letter in the alphabet
      const randomLetter = String.fromCharCode('A'.charCodeAt(0) + randomIndex);
      return randomLetter;
  }
  const getRandomWord = useCallback(async () => {
      try {
      // Fetch a random word from Datamuse API
      const response = await fetch('https://api.datamuse.com/words?sp='+getRandomLetter()+'*');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Extract and return the random word
      return data[Math.floor(Math.random() * (data.length - 1))].word;

      } catch (error) {
      console.error('Error fetching random word:', error);
      return null;
    } // get random word
  }, [])
  
  const getWord = useCallback(async (word) => {
      //word = trimNonAlphabetical(word);

    // Making an API call (request)
    // and getting the response back
    const response = await fetch(api_url + word + api_key);

  

    // Parsing it to JSON format
    const data = await response.json();
    
    
    // if the target word is reached
    
    setWord(trimNonAlphabetical(data[0].meta.id));
    setpartOfSpeech(data[0].fl)

    setDefinitions([[], [], []])
  
    var i = 0;
    let newDefinitions = Array(3).fill([]); // Assuming max 3 definitions

    while (data[0].shortdef[i] != null && i < 3) {
      
      var string = data[0].shortdef[i];
      var words = string.split(" ");
      
      for (var j = 0; words[j] != null; j++) {
        const wordToBePassed = words[j]
          if (hasLetters(words[j])) {

              newDefinitions[i] = [...newDefinitions[i], <WordButton word={wordToBePassed} onClick={() => getWord(wordToBePassed)} />]
              
          } else {
            
            newDefinitions[i] = [...newDefinitions[i], <WordButton word={wordToBePassed} onClick={() => {}} />]
          }
      }
      setDefinitions(newDefinitions); // Update state
      i++;
    }
    

  
  setClicks(clicks => clicks + 1);
  }, [])

  useEffect(() => {
    if (clicks > 0) {
      if (word === targetWord) {
        clearInterval(timeRef.current);
        endGame();
      }
    }
  }, [clicks, word, targetWord, endGame, timeRef]); // ✅ Include necessary dependencies
  


  // Use useEffect to call the API when the component mounts
  useEffect(() => {
    let minutes = 0;
    let seconds = 0;

    timeRef.current = setInterval(() => {
      if (!showPopup) {seconds++;}
      
      //setTotalSeconds(totalSeconds => totalSeconds + 1)
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      }

      setSecondsLabel(seconds < 10 ? `0${seconds}` : seconds);
      setMinutesLabel(minutes < 10 ? `0${minutes}` : minutes);
    }, 1000);

    // Call cleanup to stop the timer when the component is unmounted
    return () => clearInterval(timeRef.current);
  }, [showPopup]);
  useEffect(() => {
    async function initializeGame() {
      const randWord = await getRandomWord();
      
      if (randWord) {
        //setTargetWord(randWord); // Update target word first
        setTargetWord("verb");
      }
    }
  
    initializeGame();
  }, [getRandomWord]);
  
  //waits for targetWord to update before fetching the first word
  useEffect(() => {
    if (targetWord) {
      getWord("start");
      
    }
  }, [targetWord, getWord]); // Runs only after targetWord is updated
  

  return (
    <div className="App">
      <div id="content">
        <div id="targetHead">
          <h2 className="child"><WordButton word={"target :"} onClick={() => getWord("target")} style={{ fontSize: "inherit", fontWeight: "inherit" }} /></h2>
          <h2 className="child" id="targetWord">{targetWord}</h2>
        </div>
        <div>
          <hr id="line" />
        </div>
        <div id="head">
          <h1 id="word" className="child">{word}</h1>
          <h3 id="divider" className="child">&#x2022;</h3>
          <WordButton word={partOfSpeech} onClick={() => getWord(partOfSpeech)} />
        </div>
        <div id="def">
        <h4 id="def" className="child">
          {definitions.map((words, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              {words.map((word, wordIndex) => word)}
            </div>
          ))}
        </h4>

        </div>
        <div id="logo">
          <label id="count"><WordButton word={"Clicks:"} onClick={() => getWord("click")} style={{ fontSize: "inherit", fontWeight: "inherit" }} />{clicks}</label>
          <div id="logo-container">
            <img 
              src={logo}
              alt="Logo" 
              id="logo-img" 
              style={{ height: '100px', width: '100px', margin: '0 10px' }} // Adjust size and margins as needed
            />
          </div>
          <div id="timer">
            <label id="minutes">{minutesLabel}</label>
            <label id="colon">:</label>
            <label id="seconds">{secondsLabel}</label>
          </div>
          <div id ="darkButton">
          
          {isDarkMode ? 
          <WordButton word={"Light"} onClick={() => { darkMode(); getWord("light"); }} /> : 
          <WordButton word={"Dark"} onClick={() => { darkMode(); getWord("dark"); }} />}
          </div>
        </div>
        
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>🎉 You Win! 🎉</h2>
            <p>Congratulations! You got to "{targetWord}" in {minutesLabel}:{secondsLabel} - using only {clicks} clicks.</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <FacebookShareButton url={url}>
                <FaFacebook size={32} color="#1877F2" />
              </FacebookShareButton>

              <TwitterShareButton url={url} title={message}>
                <FaTwitter size={32} color="#1DA1F2" />
              </TwitterShareButton>

              <WhatsappShareButton url={url} title={message}>
                <FaWhatsapp size={32} color="#25D366" />
              </WhatsappShareButton>
            </div>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
    
  );
}

export default App;
