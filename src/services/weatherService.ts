// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

import axios from "axios";
// const axios = require("axios");

const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

// create function called fetchWeatherByCity that will be responsible for calling the API and returning the response

const fetchWeatherByCity = async (city: string) => {
  
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        q: city,
        units: 'imperial',
        appid: API_KEY,
      }
    });
    return response.data;
  } catch (error) {
    console.log('Error in fetching data', error);
    return null;
  }
};

// console.log(fetchWeatherByCity('Boston').weather[0].description);
export default fetchWeatherByCity