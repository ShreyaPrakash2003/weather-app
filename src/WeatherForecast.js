import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const apiKey = "6ba52c12f1be33e38cfc2d9efcfed96d";

export default function WeatherForecast() {
  const [weather, setWeather] = useState({
    icon: "https://openweathermap.org/img/wn/10d@2x.png",
    temp: "20",
    city: "Paris",
    humidity: "30",
    speed: "20"
  });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
    setHistory(saved);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const city = event.target.city.value;
    if (!city) {
      alert("Please provide a valid city name");
      return;
    }
    fetchWeather(city);
  }

  function fetchWeather(city) {
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    )
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => {
        const newWeather = {
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          temp: data.main.temp,
          city: data.name,
          humidity: data.main.humidity,
          speed: data.wind.speed
        };
        setWeather(newWeather);
        updateHistory(data.name);
        fetchForecast(data.coord.lat, data.coord.lon);
        setLoading(false);
      })
      .catch(() => {
        alert("Unable to fetch the weather forecast");
        setLoading(false);
      });
  }

  function fetchForecast(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    )
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => {
        setForecast(data.list.slice(0, 5)); // Get 5 upcoming forecasts (3-hour interval)
      })
      .catch(() => alert("Failed to load 5-day forecast"));
  }

  function updateHistory(city) {
    let updated = [city, ...history.filter((c) => c !== city)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(updated));
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  const themeStyles = {
    light: {
      backgroundColor: "#3B5FAB",
      color: "black"
    },
    dark: {
      backgroundColor: "#1e293b",
      color: "white"
    }
  };

  return (
    <div className="container my-5">
      <div
        className="mx-auto rounded border text-center p-4"
        style={{ ...themeStyles[theme], width: "400px" }}
      >
        <h2 className="fw-bold mb-4">Weather Forecast</h2>

        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-sm btn-secondary" onClick={toggleTheme}>
            Toggle {theme === "light" ? "Dark" : "Light"} Theme
          </button>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => fetchWeather(weather.city)}
          >
            Refresh
          </button>
        </div>

        <form className="d-flex mb-3" onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            placeholder="City"
            name="city"
          />
          <button className="btn btn-outline-light" type="submit">
            Search
          </button>
        </form>

        {loading ? (
          <div className="my-4">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={weather.icon.trim()} alt="weather icon" />
            <h1 className="display-4 fw-medium">{weather.temp}℃</h1>
            <h1 className="mb-4">{weather.city}</h1>
            <div className="row mb-3">
              <div className="col">
                <i className="bi bi-water"></i> Humidity <br />
                {weather.humidity} %
              </div>
              <div className="col">
                <i className="bi bi-wind"></i> Wind speed <br />
                {weather.speed} km/hr
              </div>
            </div>
            <div>
              <h5 className="mt-4">Recent Searches</h5>
              <ul className="list-unstyled">
                {history.map((city, i) => (
                  <li key={i}>
                    <button
                      className="btn btn-sm btn-link text-light"
                      onClick={() => fetchWeather(city)}
                    >
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
              <h5 className="mt-4">5-Day Forecast</h5>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {forecast.map((entry, i) => (
                  <div
                    key={i}
                    className="p-2 rounded"
                    style={{
                      backgroundColor: theme === "light" ? "#fff" : "#334155",
                      color: theme === "light" ? "#000" : "#fff",
                      width: "100px"
                    }}
                  >
                    <div>{new Date(entry.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <img
                      src={`https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`}
                      alt="forecast icon"
                    />
                    <div>{entry.main.temp.toFixed(0)}℃</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}