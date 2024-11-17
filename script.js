const apiKey = "c0bc97f7feb24972bce211137241311";
const endpoint = 'https://api.weatherapi.com/v1/current.json';

// Make sure JavaScript only loads after everything else
document.addEventListener('DOMContentLoaded', function() {
  // Grabbing data from form submit
  document.getElementById('weather-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    // Grab city name from form input
    const cityName = document.getElementById("city").value.trim();
    
    // Clear any previous error messages
    clearErrorMessage();

    // If form is valid, proceed
    if (validForm(cityName)) {
      
      // Checks for temp unit
      const fahrenheitTemp = document.getElementById("fahren").checked;
      const celsiusTemp = document.getElementById("celsius").checked;
      const unit = fahrenheitTemp ? 'fahrenheit' : celsiusTemp ? 'celsius' : 'celsius'; // Default to Celsius if nothing selected

      // Construct the API URL with the city name and desired unit
      // q = search for city name
      // aq (air quality) don't get data
      const apiURL = `${endpoint}?key=${apiKey}&q=${cityName}&aqi=no`;
      

      try {
        // Fetch the weather data
        const weatherData = await fetchWeather(apiURL);
        console.log('Weather Data:', weatherData); // Logs the fetched weather data
        displayWeather(weatherData, unit); // Call the function to display the data with the correct unit
      } catch (error) {
        console.error("Error fetching weather data:", error);
        showErrorMessage("Sorry, something went wrong while fetching the weather data.");
      }
    } else {
      showErrorMessage("Please put in a city to search for.");
    }
  });
});

// Helper function to validate form input
function validForm(cityName) {
  let isValid = true;

  // Check if city name is entered
  if (!cityName) {
    isValid = false;
  }

  // Check if a temperature unit (Celsius or Fahrenheit) is selected
  const fahrenTemp = document.getElementById("fahren").checked;
  const celsiusTemp = document.getElementById("celsius").checked;
  if (!fahrenTemp && !celsiusTemp) {
    isValid = false;
  }

  return isValid;
}

// Function to display error messages on the page
function showErrorMessage(message) {
  const errorContainer = document.getElementById("error-message");
  errorContainer.textContent = message;
  errorContainer.style.display = "block"; // Ensure the error message is visible
}

// Function to clear any existing error messages
function clearErrorMessage() {
  const errorContainer = document.getElementById("error-message");
  errorContainer.textContent = ''; // Clear the message
  errorContainer.style.display = "none"; // Hide the error message container
}

// Async function to fetch weather data from the API
const fetchWeather = async (apiURL) => {
  try {
    const response = await fetch(apiURL);
    console.log("API Response Status:", response.status);  // Log the response status

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error; // Throw error to be caught in the calling function
  }
};

// Function to display the weather data on the page
function displayWeather(weatherData, unit) {
  const weatherContainer = document.getElementById("weather-info");

  // Check if we have valid data
  if (!weatherData || !weatherData.location) {
    showErrorMessage("Sorry, no data found for the specified city.");
    return;
  }

  // Get the data from the API
  const city = weatherData.location.name;
  const temperatureCelsius = weatherData.current.temp_c;
  const temperatureFahrenheit = weatherData.current.temp_f;
  const condition = weatherData.current.condition.text;
  const windSpeed = weatherData.current.wind_kph;
  const humidity = weatherData.current.humidity;

  // Convert temperature based on selected unit
  let displayTemperature = '';
  if (unit === 'fahrenheit') {
    displayTemperature = `${temperatureFahrenheit}°F`;
  } else {
    displayTemperature = `${temperatureCelsius}°C`;
  }

  // Create HTML content with the fetched weather data
  weatherContainer.innerHTML = `
    <h3>Weather in ${city}</h3>
    <p><strong>Condition:</strong> ${condition}</p>
    <p><strong>Wind Speed:</strong> ${windSpeed} km/h</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
    <p><strong>Temperature:</strong> ${displayTemperature}</p>
  `;
}