const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchWeather = async (lat, long) => {
  const response = await fetch(
    `${API_BASE_URL}/weather?lat=${lat}&lon=${long}&units=metric&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  return response.json();
};