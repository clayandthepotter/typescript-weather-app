
// What a correct URL should look like:
// https://api.openweathermap.org/data/2.5/weather?q=Boston&units=imperial&appid=767744e61bf677eb3a3361d0dc3c8dc2

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// import axios to fetch api data
import axios from "axios";
// const axios = require("axios");

// creates variables to store the base url and our api key
const BASE_URL = "https://api.openweathermap.org/";
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

// create an interface to specify what the API response look like
// my weatherApiResponse should adhere to this shape

//   cityName: string,
//   minTemp: number,
//   maxTemp: number,
//   humidityPercent: number,
//   description: string,

// interface CityAPIResponse [

// ]

interface WeatherAPIResponse {
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather : [{
    description: string;
  }];
  name: string;
}

interface WeatherAPIForecastResponse {
  list: [{
    main: {
      temp: string;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: [{
      description: string;
    }];
    dt_txt: string;
  }]
}

interface City {
  
  name: string;
  local_names: {
    en: string;
  };
  lat: number;
  lon: number;
  country: string;
  state: string; 
  
}

interface CityAPIResponse {
  [index: number]: City;
}


// create function called fetchWeatherByCity that will be responsible for calling the API and returning the response
// async functions always retun a promise, so in typescript when specifying the return type for an async function, use the following syntax  Promise< this | that>
// the Promise returnes by this function will eaither be something that adheres to the weatherAPI interface or it will return null
export const fetchWeatherByCity = async (city: string | undefined): Promise<WeatherAPIResponse | null> => {
  // always good practice to use try/catch when calling an API for error handling
  try {
    // make an axios call to the api and store the response in variable
    const response = await axios.get(`${BASE_URL}data/2.5/weather`, {

      params: {
        q: city,
        units: 'imperial',
        appid: API_KEY,
      }
    });
    // return the data from the response
    return response.data;
  // if there is an error
  } catch (error) {
    // log it out
    console.log('Error in fetching data', error);
    // funtion always needs to return something even if null
    return null;
  }
};

export const fetchForecastByCity = async (city: string | undefined): Promise<WeatherAPIForecastResponse | null> => {
  // always good practice to use try/catch when calling an API for error handling
  try {
    // make an axios call to the api and store the response in variable
    const response = await axios.get(`${BASE_URL}data/2.5/forecast`, {

      params: {
        q: city,
        units: 'imperial',
        appid: API_KEY,
      }
    });
    // return the data from the response
    return response.data;
  // if there is an error
  } catch (error) {
    // log it out
    console.log('Error in fetching data', error);
    // funtion always needs to return something even if null
    return null;
  }
};


export const fetchCity = async (city: string): Promise<CityAPIResponse | null> => {
  // always good practice to use try/catch when calling an API for error handling
  try {
    // make an axios call to the api and store the data in the response variable
    const response = await axios.get(`${BASE_URL}geo/1.0/direct`, {

      params: {
        q: city,
        limit: 5,
        appid: API_KEY,
      }
    });
    // return the data from the response
    return response.data;
  // if there is an error
  } catch (error) {
    // log it out
    console.log('Error in fetching data', error);
    // funtion always needs to return something even if null
    return null;
  }
};

