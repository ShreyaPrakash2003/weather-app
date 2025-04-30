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
        setForecast(data.list.slice(0, 5));
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
      backgroundColor: "#ffffff", // White background for light theme
      color: "#333333", // Dark gray text
      backgroundImage: "linear-gradient(to bottom, #a8dadc, #457b9d)", // Soft blue gradient
      buttonBackground: "#1d3557", // Deep blue for buttons
      buttonHover: "#457b9d" // Lighter blue on hover
    },
    dark: {
      backgroundColor: "#1e293b", // Dark background for dark theme
      color: "#e5e5e5", // Light gray text
      backgroundImage: "linear-gradient(to bottom, #0f172a, #1e293b)", // Dark gradient background
      buttonBackground: "#2d3e50", // Dark button background
      buttonHover: "#4a6378" // Lighter grayish-blue on hover
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundImage: themeStyles[theme].backgroundImage,
        minHeight: "100vh",
        transition: "background 0.5s ease",
        backgroundColor: themeStyles[theme].backgroundColor
      }}
    >
      <div
        className="mx-auto rounded border text-center p-4 shadow-lg"
        style={{
          backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
          color: themeStyles[theme].color,
          width: "400px",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <motion.h2
          className="fw-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🌦️ Weather Forecast
        </motion.h2>

        <div className="d-flex justify-content-between mb-3">
          <motion.button
            className="btn btn-sm"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: themeStyles[theme].buttonBackground,
              color: "#fff",
              border: "none"
            }}
          >
            Toggle {theme === "light" ? "Dark" : "Light"} Theme
          </motion.button>
          <motion.button
            className="btn btn-sm btn-outline-light"
            onClick={() => fetchWeather(weather.city)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              borderColor: theme === "light" ? "#1d3557" : "#2d3e50",
              color: theme === "light" ? "#1d3557" : "#4a6378"
            }}
          >
            Refresh
          </motion.button>
        </div>

        <form className="d-flex mb-3" onSubmit={handleSubmit}>
          <motion.input
            className="form-control me-2"
            placeholder="City"
            name="city"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.button
            className="btn btn-outline-light"
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              borderColor: theme === "light" ? "#1d3557" : "#2d3e50",
              color: theme === "light" ? "#1d3557" : "#4a6378"
            }}
          >
            Search
          </motion.button>
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
            <motion.img
              src={weather.icon.trim()}
              alt="weather icon"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.h1
              className="display-4 fw-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {weather.temp}℃
            </motion.h1>
            <motion.h1
              className="mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {weather.city}
            </motion.h1>
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
              <motion.h5
                className="mt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Recent Searches
              </motion.h5>
              <ul className="list-unstyled">
                {history.map((city, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      className="btn btn-sm btn-link text-light"
                      onClick={() => fetchWeather(city)}
                    >
                      {city}
                    </button>
                  </motion.li>
                ))}
              </ul>
              <motion.h5
                className="mt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                5-Day Forecast
              </motion.h5>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {forecast.map((entry, i) => (
                  <motion.div
                    key={i}
                    className="p-2 rounded"
                    style={{
                      backgroundColor:
                        theme === "light" ? "#e0f2fe" : "#2d3e50",
                      color: theme === "light" ? "#000" : "#fff",
                      width: "100px"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.2 }}
                  >
                    <div>
                      {new Date(entry.dt_txt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                    <img
                      src={`https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`}
                      alt="forecast icon"
                    />
                    <div>{entry.main.temp.toFixed(0)}℃</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
