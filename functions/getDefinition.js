//const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    // Get the word from query parameters
    const { word } = event.queryStringParameters;
    if (!word) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Please provide a word" }),
      };
    }
    const API_KEY = process.env.REACT_APP_API_KEY
    const api_url = "https://dictionaryapi.com/api/v3/references/collegiate/json/";
    // Fetch definition from the external API
    const response = await fetch(api_url + word + API_KEY);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Word not found" }),
      };
    }

    const data = await response.json();

    // Return the API response
    return {
      response
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
};
