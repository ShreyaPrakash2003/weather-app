import React from 'react';
import ReactDOM from 'react-dom/client';
import WeatherForecast from './WeatherForecast';
function App(){
  return (
    <>
    <WeatherForecast/>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

