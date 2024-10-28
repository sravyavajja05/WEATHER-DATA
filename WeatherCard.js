import React, { useState } from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {weatherData.name}, {weatherData.sys.country}
        </h2>
        <div className="text-4xl font-bold text-blue-600 mb-4">
          {Math.round(weatherData.main.temp)}°C
        </div>
        <div className="text-gray-600 mb-4 capitalize">
          {weatherData.weather[0].description}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-500">Feels Like</div>
          <div className="font-semibold">{Math.round(weatherData.main.feels_like)}°C</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-500">Humidity</div>
          <div className="font-semibold">{weatherData.main.humidity}%</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-500">Wind Speed</div>
          <div className="font-semibold">{weatherData.wind.speed} km/h</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-500">Wind Direction</div>
          <div className="font-semibold">{weatherData.wind.direction}</div>
        </div>
      </div>
    </div>
  );
};

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Put your WeatherAPI key here
  const API_KEY = "63eb84c2d4b74bf0b55160337242810";  // Replace this with your actual WeatherAPI key

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no'
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }

      const data = await response.json();
      
      const transformedData = {
        name: data.location.name,
        main: {
          temp: data.current.temp_c,
          humidity: data.current.humidity,
          feels_like: data.current.feelslike_c
        },
        weather: [{
          description: data.current.condition.text,
          icon: data.current.condition.icon
        }],
        wind: {
          speed: data.current.wind_kph,
          deg: data.current.wind_degree,
          direction: data.current.wind_dir
        },
        sys: {
          country: data.location.country
        }
      };

      setWeather(transformedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-4">Weather Dashboard</h1>
        
        <form onSubmit={fetchWeather} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}
        </form>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <WeatherCard weatherData={weather} />
      )}
    </div>
  );
};

export default WeatherDashboard;