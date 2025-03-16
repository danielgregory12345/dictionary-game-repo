import React, { useEffect, useState, useCallback } from 'react';
import WordButton from "./WordButton";
import logo from './1024px-Merriam-Webster_logo.png';

import './App.css';

function App() {
  const api_url = "https://dictionaryapi.com/api/v3/references/collegiate/json/";
  const api_key = "?key=277f50c5-43d2-45ae-9643-30de29c388f6";

  // State variables to store word and def
  const [word, setWord] = useState('');
  const [clicks, setClicks] = useState(-2);
  const [partOfSpeech, setpartOfSpeech] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [targetWordBase, setTargetWordBase] = useState('');
  const [count, setCount] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [minutesLabel, setMinutesLabel] = useState('00');
  const [secondsLabel, setSecondsLabel] = useState('00');



  const [definitions, setDefinitions] = useState([[], [], []]); // Array for def1, def2, def3

  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
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
  function endGame() {
    setShowPopup(true); // Show the popup when the user wins
  }

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
  async function getRandomWord() {
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
  }
  
  async function getWord(word) {
      //word = trimNonAlphabetical(word);

    // Making an API call (request)
    // and getting the response back
    const response = await fetch(api_url + word + api_key);

  

    // Parsing it to JSON format
    const data = await response.json();

    if (trimNonAlphabetical(data[0].meta.id) === targetWord) {
      endGame();
      return;
    } // if the target word is reached
    setClicks(clicks => clicks + 1);
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
    

  setCount(count + 1)
  }


  // Use useEffect to call the API when the component mounts
  useEffect(() => {
    let minutes = 0;
    let seconds = 0;

    const timerInterval = setInterval(() => {
      if (!showPopup) {seconds++;}
      
      setTotalSeconds(totalSeconds => totalSeconds + 1)
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      }

      setSecondsLabel(seconds < 10 ? `0${seconds}` : seconds);
      setMinutesLabel(minutes < 10 ? `0${minutes}` : minutes);
    }, 1000);

    // Call cleanup to stop the timer when the component is unmounted
    return () => clearInterval(timerInterval);
  }, []);
  useEffect(() => {
    
    getRandomWord().then(randWord => {

      setTargetWord(randWord)
   
  });


  getWord("start");
    
  }, []);

  return (
    <div className="App">
      <div id="content">
        <div id="targetHead">
          <h2 className="child">target:</h2>
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
          <label id="count">Clicks: {clicks}</label>
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
        </div>
        <div>
          <button id="darkButton" onClick={() => darkMode()}>Dark/Light</button>
        </div>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>🎉 You Win! 🎉</h2>
            <p>Congratulations! You got to "{targetWord}" in {minutesLabel}:{secondsLabel} - using only {clicks} clicks.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
    
  );
}

export default App;
