const getCityName = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const formCity = document.getElementById("form-city");
  const cityName = searchParams.get("city");
  if (cityName) {
    formCity.value = cityName;
    return cityName;
  }
};

const getCityInfo = async (cityName) => {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
    );
    const resJson = await res.json();
    return resJson.results[0];
  } catch (err) {
    console.error(err);
  }
};

const getCityWeather = async (latitude, longitude) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
    );
    const resJson = await res.json();
    return resJson;
  } catch (err) {
    console.error(err);
  }
};

const showCityData = (info, weather) => {
  document.getElementById("city-name").textContent = info.name;
  document.getElementById("city-temperature").textContent =
    weather.current.temperature_2m + weather.current_units.temperature_2m;
  //input info data
  const table = document.getElementById("city-info");
  const items = table.querySelectorAll("tr");
  items.forEach((item) => {
    const key = item.classList[0];
    if (key && info[key]) {
      item.querySelector("td:last-child").textContent = info[key];
    }
  });
  //input forecast
  const temperatureMin = weather.daily.temperature_2m_min + weather.daily_units.temperature_2m_min;
  const temperatureMax = weather.daily.temperature_2m_max + weather.daily_units.temperature_2m_max;
  const forecastValue = `Low:${temperatureMin}<br>Max:${temperatureMax}`;
  table.querySelector(".forecast td:last-child").innerHTML = forecastValue;
};

const search = async () => {
  try {
    const name = await getCityName();
    const info = await getCityInfo(name);
    const weather = await getCityWeather(info.latitude, info.longitude);
    await showCityData(info, weather);
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener("DOMContentLoaded", search);
