import React from 'react';
import './App.css';
import fetchWeatherByCity from './services/weatherService';

function App() {
  return (
    <div>
     <p>{JSON.stringify(fetchWeatherByCity('Boston'))}</p>
    </div>
  );
}

export default App;
