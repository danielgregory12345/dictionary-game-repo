exports.handler = async () => {
    const words = ["apple", "banana", "cherry", "date", "elderberry"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
  
    // Store the word in a static JSON file (or a database)
    const fs = require("fs");
    const filePath = "../public/daily-word.json"; // Static file accessible by frontend
  
    fs.writeFileSync(filePath, JSON.stringify({ word: randomWord }));
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Word updated successfully", word: randomWord }),
    };
  };
  