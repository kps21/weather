import "./App.css";
//Weather Image
import sunny from "./assets/sunny.jpeg";
// import wind from "./assets/windy.jpeg";
import cloudy from "./assets/cloudy.jpeg";
import partSunny from "./assets/Partly sunny.jpeg";
import snow from "./assets/snowy.jpeg";
import rain from "./assets/rainy.jpeg";
import humiditys from "./assets/humidity.png";
import windIcon from "./assets/windIcon.jpg";

// Search Icon
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

let api_key = "f11943ff953390a1e3be42d302cfd4c6";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="img">
        <img src={icon} alt="img" />
      </div>
      {/* <>Alt+0176 for degree symbol</> */}
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">Longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img
            src={humiditys}
            alt="humidity"
            className="icon"
            style={{ width: "40px" }}
          />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img
            src={windIcon}
            alt="windIcon"
            className="icon"
            style={{ width: "40px" }}
          />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [text, setText] = useState("Chennai");
  const [icon, setIcon] = useState("");
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": sunny,
    "01n": sunny,
    "02d": cloudy,
    "02n": cloudy,
    "03d": partSunny,
    "03n": partSunny,
    "04d": partSunny,
    "04n": partSunny,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404") {
        console.log("City Not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || sunny);
      setCityNotFound(false);
    } catch (error) {
      console.error(error.message);
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(function () {
    search();
  }, []);
  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            value={text}
            onChange={handleCity}
            onKeyDown={handleKeyDown}
          />
          <div className="search-Icon" onClick={() => search()}>
            <FaSearch alt="Search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
        {!cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}
      </div>
    </>
  );
}

export default App;
