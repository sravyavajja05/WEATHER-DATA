// src/App.js
import React from 'react';
import WeatherDashboard from './components/WeatherDashboard';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <WeatherDashboard />
    </div>
  );
}

export default App;