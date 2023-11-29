import {
	useState,
	useEffect,
	ChangeEvent,
	KeyboardEvent,
} from 'react';
import './App.css';
import {
	fetchWeatherByCity,
	fetchForecastByCity,
  fetchCity
} from './services/weatherService';

// Define interface for this file as well
interface WeatherData {
	cityName: string;
	minTemp: number;
	maxTemp: number;
	description: string;
}

interface WeatherForecastData {
	list: [
		{
			main: {
				temp: string;
				feels_like: number;
				temp_min: number;
				temp_max: number;
				humidity: number;
			};
			weather: [
				{
					description: string;
				}
			];
			dt_txt: string;
		}
	];
}

interface CityData {
	cityName: string;
	lat: number;
	lon: number;
	state: string;
  country: string;
}

function App() {
	// Create state variables to store weather info and forecast
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [forecast, setForecast] =	useState<WeatherForecastData | null>(null);
	const [cityData, setCityData] = useState<CityData | null>(null);
  const [input, setInput] = useState<string>('');
	const [isCelsius, setIsCelsius] = useState(false);

  const convertTemp = (temp: number, unit: string) => {
		if (unit === 'F') return temp;
    const convertedTemp = ((temp - 32) * 5) / 9;
		return convertedTemp.toFixed(2);
	};

	// Function to toggle temperature unit (Celsius/Fahrenheit)
	const toggleTempUnit = () => {
		setIsCelsius(prev => !prev);
	};

	// Function to convert Fahrenheit to Celsius
	// const convertToCelsius = (
	// 	temp: number | undefined
	// ): string | undefined => {
	// 	if (temp === undefined) {
	// 		return undefined;
	// 	}
	// 	const convertedTemp = ((temp - 32) * 5) / 9;
	// 	return convertedTemp.toFixed(2);
	// };

	// Temperature unit based on the state
	const tempUnit = isCelsius ? 'C' : 'F';
	// const maxTemp = isCelsius
	// 	? convertToCelsius(weather?.maxTemp)
	// 	: weather?.maxTemp;
	// const minTemp = isCelsius
	// 	? convertToCelsius(weather?.minTemp)
	// 	: weather?.minTemp;
  
	// useEffect to fetch weather and forecast data on city change
	useEffect(() => {
		handleSubmit();
	}, [input]);

	// Function to handle city input change
	const handleCityInput = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setInput(e.target.value);
	};

	// Function to handle Enter key press
	const handleEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSubmit();
		}
	};

	// Function to fetch weather and forecast data
	const handleSubmit = async () => {
		try {
      const cityResponse = await fetchCity(input);
      if (cityResponse) {
        setCityData({
          cityName: cityResponse[0].name,
          lat: cityResponse[0].lat,
          lon: cityResponse[0].lon,
          state: cityResponse[0].state,
          country: cityResponse[0].country
        });
      }
      console.log(cityResponse)

			const weatherResponse = await fetchWeatherByCity(input);
			if (weatherResponse) {
				setWeather({
					cityName: weatherResponse.name,
					minTemp: weatherResponse.main.temp_min,
					maxTemp: weatherResponse.main.temp_max,
					description: weatherResponse.weather[0].description,
				});
			}

			const weatherForecast = await fetchForecastByCity(input);
			if (weatherForecast) {
				setForecast(weatherForecast);
			}
		} catch (err) {
			console.error(`Your error is: ${err}`);
		}
	};

	// Function to group forecast by day
	const groupForecastByDay = () => {
		const days: { [key: string]: any } = {};

		if (forecast?.list) {
			forecast.list.forEach((item) => {
				const date = item.dt_txt.split(' ')[0];
				if (!days[date]) {
					days[date] = [];
				}
				days[date].push(item);
			});
		}

		return days;
	};

	return (
		<div style={{ padding: '20px' }}>
			<div>
			  <header
			  	style={{
			  		marginInline: 'auto',
			  		display: 'flex',
			  		justifyContent: 'space-between',
			  	}}
			  >
			  	<h1>Weather Forecaster</h1>
			  </header>
			  <form action='submit'>
			  	<input
			  		style={{ marginRight: '10px', padding: '10px' }}
			  		placeholder='Search a city...'
			  		onChange={handleCityInput}
			  		onKeyDown={handleEnterKey}
			  	></input>
			  </form>
			  {weather ? <h3>Current weather information for:</h3> : ''}
			  <h4>
			  	{cityData
			  		? `${cityData.cityName}, ${cityData.state}, ${cityData.country}`
			  		: ''}
			  </h4>
			  <p>
			  	{cityData ? `Lat: ${cityData.lat}, Lon: ${cityData.lon}` : ''}
			  </p>
			  <div
			  	style={{
			  		display: 'flex',
			  	}}
			  >
			  	<div
			  		style={{
			  			marginRight: '20px',
			  			alignContent: 'space-between',
			  		}}
			  	>
			  		{weather ? <h3>Max Temp:</h3> : ''}
			  		{weather ? <p>
			  			{weather
			  				? convertTemp(weather.maxTemp, tempUnit) +
			  				  ' °' +
			  				  tempUnit
			  				: '...'}
			  		</p> : ''}
			  	</div>
			  	<div style={{ marginRight: '20px' }}>
			  		{weather ? <h3>Min Temp:</h3> : ''}
			  		{weather ? <p>
			  			{weather
			  				? convertTemp(weather.minTemp, tempUnit) +
			  				  ' °' +
			  				  tempUnit
			  				: '...'}
			  		</p> : ''}
			  	</div>
			  	<div style={{ marginRight: '20px' }}>
			  		{weather ? <h3>Description:</h3> : ''}
			  		{weather ? <p>{weather ? weather.description : '...'}</p> : ''}
			  	</div>
			  </div>
			  <div style={{marginTop: '20px'}}>
			  	{weather? <button
			  		style={{ margin: 'auto', maxHeight: '20px' }}
			  		onClick={toggleTempUnit}
			  	>
			  		Toggle Temp Unit
			  	</button> : ''}
			  </div>
			  <br />
			  <div>
			  	{weather ? <h2>Five Day Forecast</h2> : ''}
			  	<div
			  		style={{
			  			display: 'flex',
			  			flexDirection: 'column',
			  		}}
			  	>
			  		{Object.values(groupForecastByDay()).map(
			  			(dayForecast: any, index) => {
			  				return (
									<div
										key={index}
										style={{
											width: '94vw',
											background: 'black',
											marginBottom: '10px',
										}}
									>
										<h3
											style={{
												color: 'white',
												background: 'black',
												padding: '5px',
											}}
										>
											Forecast for {cityData?.cityName},{' '}
											{cityData?.state}{' | '}
											{dayForecast[0]?.dt_txt.split(' ')[0]}
										</h3>
										<div>
											<table style={{ width: '94vw' }}>
												<thead>
													<tr style={{ background: '#ccc' }}>
														<th>Time</th>
														<th>Temperature</th>
														<th>Feels Like</th>
														<th>Min Temp</th>
														<th>Max Temp</th>
														<th>Humidity</th>
														<th>Description</th>
													</tr>
												</thead>
												<tbody style={{ background: 'white' }}>
													{dayForecast.map((item: any) => (
														<tr key={item.dt_txt}>
															<td>{item.dt_txt.split(' ')[1]}</td>
															<td>
																{convertTemp(
																	item.main.temp,
																	tempUnit
																) +
																	' °' +
																	tempUnit}
															</td>
															<td>
																{convertTemp(
																	item.main.feels_like,
																	tempUnit
																) +
																	' °' +
																	tempUnit}
															</td>
															<td>
																{convertTemp(
																	item.main.temp_min,
																	tempUnit
																) +
																	' °' +
																	tempUnit}
															</td>
															<td>
																{convertTemp(
																	item.main.temp_max,
																	tempUnit
																) +
																	' °' +
																	tempUnit}
															</td>
															<td>{item.main.humidity}%</td>
															<td>{item.weather[0].description}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								);
			  			}
			  		)}
			  	</div>
			  </div>
			</div>
		</div>
	);
}

export default App;
