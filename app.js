const apiKey = 'fd5b711a680cd120e44fceb5847fccfa'; // Replace with your OpenWeatherMap API key

// Global state
let isMetric = true; // Temperature unit preference
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
let currentLat = null;
let currentLon = null;

// Mock weather data for testing
const mockWeatherData = {
  name: "London",
  sys: { country: "GB", sunrise: 1640071200, sunset: 1640104800 },
  main: { 
    temp: 15.3, 
    feels_like: 13.2, 
    temp_min: 12.1, 
    temp_max: 18.5, 
    humidity: 65, 
    pressure: 1013 
  },
  weather: [{ 
    main: "Clouds", 
    description: "scattered clouds", 
    icon: "03d" 
  }],
  wind: { speed: 3.6 },
  visibility: 10000,
  coord: { lat: 51.5074, lon: -0.1278 }
};

// DOM elements
const cityInput = document.getElementById('cityInput');
const weatherResultDiv = document.getElementById('weatherResult');
const forecastResultDiv = document.getElementById('forecastResult');
const loadingIndicator = document.getElementById('loading');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const unitToggleBtn = document.getElementById('unitToggleBtn');
const airQualityDiv = document.getElementById('airQuality');
const weatherAlertsDiv = document.getElementById('weatherAlerts');
const hourlyForecastDiv = document.getElementById('hourlyForecast');
const weatherMapDiv = document.getElementById('weatherMap');
const cityComparisonDiv = document.getElementById('cityComparison');
const recentSearchesDiv = document.getElementById('recentSearches');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme system first
    WeatherTheme.initializeTheme();
    
    loadRecentSearches();
    setRandomWeatherBackground();
    loadThemePreference();
    addTouchFeedback();
    initializeSmoothScroll();
    initializePWAPrompt();
    optimizePerformance();
});

/**
 * Handles the key press event on the city input field.
 * If the 'Enter' key is pressed, it triggers the weather search.
 * @param {KeyboardEvent} event The keyboard event object.
 */
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    getWeather();
  }
}

/**
 * Get user's current location and fetch weather
 */
function getCurrentLocation() {
  if (navigator.geolocation) {
    loadingIndicator.style.display = 'block';
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;
        getWeatherByCoords(currentLat, currentLon);
      },
      (error) => {
        loadingIndicator.style.display = 'none';
        weatherResultDiv.innerHTML = '<span class="error-message">Unable to get your location. Please enter a city manually.</span>';
      }
    );
  } else {
    weatherResultDiv.innerHTML = '<span class="error-message">Geolocation is not supported by your browser.</span>';
  }
}

/**
 * Fetch weather by coordinates
 */
async function getWeatherByCoords(lat, lon) {
  try {
    const units = isMetric ? 'metric' : 'imperial';
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    const response = await fetch(currentUrl);
    
    if (!response.ok) {
      throw new Error('Unable to fetch weather for your location');
    }
    
    const data = await response.json();
    cityInput.value = `${data.name}, ${data.sys.country}`;
    displayWeatherData(data);
    await fetchAdditionalData(data.name, lat, lon);
    
  } catch (error) {
    weatherResultDiv.innerHTML = `<span class="error-message">${error.message}</span>`;
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

/**
 * Toggle between Celsius and Fahrenheit
 */
function toggleUnits() {
  isMetric = !isMetric;
  unitToggleBtn.innerHTML = isMetric ? '<i class="fas fa-thermometer-half"></i> °F' : '<i class="fas fa-thermometer-half"></i> °C';
  
  // Re-fetch weather if we have current data
  if (cityInput.value.trim()) {
    getWeather();
  }
}

/**
 * Save search to recent searches
 */
function saveToRecentSearches(cityName) {
  if (!recentSearches.includes(cityName)) {
    recentSearches.unshift(cityName);
    if (recentSearches.length > 5) {
      recentSearches.pop();
    }
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    loadRecentSearches();
  }
}

/**
 * Load and display recent searches
 */
function loadRecentSearches() {
  if (recentSearches.length > 0) {
    recentSearchesDiv.style.display = 'block';
    const recentCitiesDiv = document.getElementById('recentCities');
    recentCitiesDiv.innerHTML = recentSearches.map(city => 
      `<span class="recent-city" onclick="searchCity('${city}')">${city}</span>`
    ).join('');
  }
}

/**
 * Search for a recent city
 */
function searchCity(cityName) {
  cityInput.value = cityName;
  getWeather();
}

/**
 * Set random weather-themed background
 */
function setRandomWeatherBackground() {
  const backgrounds = [
    'linear-gradient(135deg, #74b9ff, #0984e3)',
    'linear-gradient(135deg, #fd79a8, #e84393)',
    'linear-gradient(135deg, #fdcb6e, #e17055)',
    'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    'linear-gradient(135deg, #00b894, #00cec9)'
  ];
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.background = randomBg;
}

/**
 * Load theme preference from localStorage
 */
function loadThemePreference() {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  if (isDarkTheme) {
    document.body.classList.add('dark-theme');
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Theme';
  }
}

/**
 * Demo function to show the new weather card with mock data
 */
function showWeatherCardDemo() {
  console.log('Showing weather card demo with mock data');
  displayWeatherData(mockWeatherData);
}

/**
 * Fetches and displays current weather and 5-day forecast for a given city.
 */
async function getWeather() {
  const city = cityInput.value.trim();

  // Clear previous results and show loading indicator
  weatherResultDiv.innerHTML = '';
  forecastResultDiv.innerHTML = '';
  hourlyForecastDiv.innerHTML = '';
  airQualityDiv.innerHTML = '';
  weatherAlertsDiv.innerHTML = '';
  loadingIndicator.style.display = 'block';

  if (!city) {
    loadingIndicator.style.display = 'none';
    weatherResultDiv.innerHTML = '<span class="error-message">Please enter a city name.</span>';
    return;
  }

  try {
    const units = isMetric ? 'metric' : 'imperial';
    const tempUnit = isMetric ? '°C' : '°F';
    
    // --- Fetch Current Weather Data ---
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
    const currentResponse = await fetch(currentUrl);

    if (!currentResponse.ok) {
      if (currentResponse.status === 404) {
        throw new Error('City not found. Please check the spelling.');
      } else {
        throw new Error(`Error: ${currentResponse.statusText}`);
      }
    }
    const currentData = await currentResponse.json();
    
    // Save to recent searches
    saveToRecentSearches(`${currentData.name}, ${currentData.sys.country}`);
    
    // Store coordinates for additional data
    currentLat = currentData.coord.lat;
    currentLon = currentData.coord.lon;

    // Display current weather information
    displayWeatherData(currentData);
    
    // Fetch additional data
    await fetchAdditionalData(city, currentLat, currentLon);

  } catch (error) {
    console.log('API call failed, showing demo instead:', error.message);
    
    // Show demo instead of error for development/testing
    weatherResultDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px; padding: 16px; background: rgba(255, 193, 7, 0.1); border-radius: 12px; border: 1px solid rgba(255, 193, 7, 0.3);">
        <p style="margin: 0; color: #856404; font-weight: 500;">
          ⚠️ API not available in demo mode. Showing sample weather data for ${city}:
        </p>
      </div>
    `;
    
    // Use mock data with the entered city name
    const demoData = { ...mockWeatherData, name: city };
    displayWeatherData(demoData);
    
    console.error('Weather fetching error:', error);
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

/**
 * Display weather data with enhanced modern UI using the new WeatherCard component
 */
function displayWeatherData(data) {
  const units = isMetric ? 'metric' : 'imperial';
  const tempUnit = isMetric ? '°C' : '°F';
  const windUnit = isMetric ? 'm/s' : 'mph';
  
  // Set dynamic background based on weather
  setWeatherBackground(data.weather[0].main);
  
  // Use the new enhanced weather card component
  const weatherCardHTML = createEnhancedWeatherCard(data);
  
  weatherResultDiv.innerHTML = weatherCardHTML;
  
  // Add hover effects and responsive styles after the card is rendered
  addWeatherCardStyles();
}

/**
 * Add dynamic styles for the weather card component
 */
function addWeatherCardStyles() {
  // Check if styles already exist
  if (document.getElementById('weather-card-dynamic-styles')) {
    return;
  }

  const theme = WeatherTheme.getCurrentTheme();
  const colors = WeatherTheme.palette[theme];
  const { shadow } = WeatherTheme;
  
  const style = document.createElement('style');
  style.id = 'weather-card-dynamic-styles';
  style.textContent = `
    .detail-card:hover {
      transform: translateY(-2px);
      box-shadow: ${theme === 'dark' ? shadow.cardDarkHover : shadow.cardHover};
    }
    
    .enhanced-weather-card:hover {
      transform: translateY(-3px);
      box-shadow: ${theme === 'dark' ? shadow.cardDarkHover : shadow.cardHover};
    }
    
    @media (max-width: 768px) {
      .enhanced-weather-card {
        max-width: 100% !important;
        margin: 0 !important;
      }
      
      .weather-header {
        flex-direction: column !important;
        text-align: center !important;
      }
      
      .sun-times {
        grid-column: span 1 !important;
      }
      
      .sun-times > div {
        flex-direction: column !important;
        gap: ${WeatherTheme.spacing.md} !important;
      }
      
      .sun-times > div > div:nth-child(2) {
        display: none !important;
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .detail-card:hover,
      .enhanced-weather-card:hover {
        transform: none;
      }
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Fetch additional weather data (forecast, air quality, alerts)
 */
async function fetchAdditionalData(city, lat, lon) {
  const units = isMetric ? 'metric' : 'imperial';
  
  try {
    // Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json();
      displayForecast(forecastData);
      displayHourlyForecast(forecastData);
    }
    
    // Fetch air quality data
    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const airQualityResponse = await fetch(airQualityUrl);
    
    if (airQualityResponse.ok) {
      const airQualityData = await airQualityResponse.json();
      displayAirQuality(airQualityData);
    }
    
  } catch (error) {
    console.error('Error fetching additional data:', error);
  }
}

/**
 * Set weather-themed background
 */
function setWeatherBackground(weatherMain) {
  // Only set weather backgrounds in light mode
  if (document.body.classList.contains('dark-theme')) {
    return; // Don't change background in dark mode
  }
  
  const weatherBackgrounds = {
    'Clear': 'linear-gradient(135deg, #87CEEB, #FFD700)',
    'Clouds': 'linear-gradient(135deg, #C0C0C0, #808080)',
    'Rain': 'linear-gradient(135deg, #4682B4, #2F4F4F)',
    'Drizzle': 'linear-gradient(135deg, #B0C4DE, #778899)',
    'Thunderstorm': 'linear-gradient(135deg, #2F2F2F, #4B0082)',
    'Snow': 'linear-gradient(135deg, #F0F8FF, #E6E6FA)',
    'Mist': 'linear-gradient(135deg, #D3D3D3, #A9A9A9)',
    'Fog': 'linear-gradient(135deg, #D3D3D3, #A9A9A9)'
  };
  
  const background = weatherBackgrounds[weatherMain] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  document.body.style.background = background;
}

/**
 * Display 5-day forecast
 */
function displayForecast(forecastData) {
  const tempUnit = isMetric ? '°C' : '°F';
  
  // Group and summarize forecast by date for daily overview
  const dailyData = {};
  const today = new Date().toISOString().split('T')[0];

  forecastData.list.forEach(entry => {
    const date = entry.dt_txt.split(' ')[0];
    if (date === today) return;

    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        weather: entry.weather[0],
        minTemp: Infinity,
        maxTemp: -Infinity,
        humidity: 0,
        wind: 0,
        count: 0
      };
    }
    dailyData[date].temps.push(entry.main.temp);
    dailyData[date].minTemp = Math.min(dailyData[date].minTemp, entry.main.temp);
    dailyData[date].maxTemp = Math.max(dailyData[date].maxTemp, entry.main.temp);
    dailyData[date].humidity += entry.main.humidity;
    dailyData[date].wind += entry.wind.speed;
    dailyData[date].count++;
  });

  forecastResultDiv.innerHTML = '<h3><i class="fas fa-calendar-alt"></i> 5-Day Forecast</h3><div class="forecast-cards">';
  
  Object.keys(dailyData).sort().slice(0, 5).forEach(date => {
    const dayInfo = dailyData[date];
    const weather = dayInfo.weather;
    const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const avgHumidity = Math.round(dayInfo.humidity / dayInfo.count);
    const avgWind = (dayInfo.wind / dayInfo.count).toFixed(1);

    const card = `
      <div class="forecast-card enhanced">
        <h4>${formattedDate}</h4>
        <img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.description}" />
        <div class="weather-desc">${weather.main}</div>
        <div class="temp-range">
          <span class="max-temp">${dayInfo.maxTemp.toFixed(1)}${tempUnit}</span>
          <span class="min-temp">${dayInfo.minTemp.toFixed(1)}${tempUnit}</span>
        </div>
        <div class="additional-info">
          <div><i class="fas fa-tint"></i> ${avgHumidity}%</div>
          <div><i class="fas fa-wind"></i> ${avgWind} ${isMetric ? 'm/s' : 'mph'}</div>
        </div>
      </div>
    `;
    forecastResultDiv.innerHTML += card;
  });
  forecastResultDiv.innerHTML += '</div>';
}

/**
 * Display hourly forecast
 */
function displayHourlyForecast(forecastData) {
  const tempUnit = isMetric ? '°C' : '°F';
  
  hourlyForecastDiv.innerHTML = '<h3><i class="fas fa-clock"></i> Next 24 Hours</h3><div class="hourly-cards">';
  
  // Show next 8 hours (3-hour intervals)
  const hourlyData = forecastData.list.slice(0, 8);
  
  hourlyData.forEach(entry => {
    const time = new Date(entry.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    const card = `
      <div class="hourly-card">
        <div class="hour-time">${time}</div>
        <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="${entry.weather[0].description}" />
        <div class="hour-temp">${entry.main.temp.toFixed(1)}${tempUnit}</div>
        <div class="hour-desc">${entry.weather[0].main}</div>
        <div class="hour-details">
          <div><i class="fas fa-tint"></i> ${entry.main.humidity}%</div>
          <div><i class="fas fa-wind"></i> ${entry.wind.speed.toFixed(1)}</div>
        </div>
      </div>
    `;
    hourlyForecastDiv.innerHTML += card;
  });
  
  hourlyForecastDiv.innerHTML += '</div>';
}

/**
 * Display air quality information
 */
function displayAirQuality(airQualityData) {
  const aqi = airQualityData.list[0].main.aqi;
  const components = airQualityData.list[0].components;
  
  const aqiLabels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  const aqiColors = ['', '#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97'];
  
  airQualityDiv.innerHTML = `
    <h3><i class="fas fa-lungs"></i> Air Quality Index</h3>
    <div class="air-quality-content">
      <div class="aqi-score" style="background-color: ${aqiColors[aqi]}">
        <span class="aqi-number">${aqi}</span>
        <span class="aqi-label">${aqiLabels[aqi]}</span>
      </div>
      <div class="pollutants">
        <div class="pollutant">
          <span>CO:</span>
          <span>${components.co.toFixed(1)} μg/m³</span>
        </div>
        <div class="pollutant">
          <span>NO₂:</span>
          <span>${components.no2.toFixed(1)} μg/m³</span>
        </div>
        <div class="pollutant">
          <span>O₃:</span>
          <span>${components.o3.toFixed(1)} μg/m³</span>
        </div>
        <div class="pollutant">
          <span>PM2.5:</span>
          <span>${components.pm2_5.toFixed(1)} μg/m³</span>
        </div>
        <div class="pollutant">
          <span>PM10:</span>
          <span>${components.pm10.toFixed(1)} μg/m³</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Toggle weather map visibility
 */
function toggleMap() {
  const isVisible = weatherMapDiv.style.display !== 'none';
  weatherMapDiv.style.display = isVisible ? 'none' : 'block';
  
  if (!isVisible && currentLat && currentLon) {
    loadWeatherMap();
  }
}

/**
 * Load weather map
 */
function loadWeatherMap() {
  const mapContainer = document.getElementById('mapContainer');
  mapContainer.innerHTML = `
    <div class="map-placeholder">
      <iframe 
        src="https://openweathermap.org/weathermap?basemap=map&zoom=10&lat=${currentLat}&lon=${currentLon}&layer=temperature"
        width="100%" 
        height="400"
        frameborder="0">
      </iframe>
    </div>
  `;
}

/**
 * Change map layer
 */
function changeMapLayer(layer) {
  if (!currentLat || !currentLon) return;
  
  document.querySelectorAll('.map-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-layer="${layer}"]`).classList.add('active');
  
  const mapContainer = document.getElementById('mapContainer');
  mapContainer.innerHTML = `
    <div class="map-placeholder">
      <iframe 
        src="https://openweathermap.org/weathermap?basemap=map&zoom=10&lat=${currentLat}&lon=${currentLon}&layer=${layer}"
        width="100%" 
        height="400"
        frameborder="0">
      </iframe>
    </div>
  `;
}

/**
 * Show city comparison section
 */
function showComparison() {
  const isVisible = cityComparisonDiv.style.display !== 'none';
  cityComparisonDiv.style.display = isVisible ? 'none' : 'block';
}

/**
 * Compare two cities
 */
async function compareCities() {
  const city1 = document.getElementById('city1Input').value.trim();
  const city2 = document.getElementById('city2Input').value.trim();
  
  if (!city1 || !city2) {
    alert('Please enter both city names');
    return;
  }
  
  try {
    const units = isMetric ? 'metric' : 'imperial';
    const tempUnit = isMetric ? '°C' : '°F';
    
    const [data1, data2] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city1)}&appid=${apiKey}&units=${units}`).then(r => r.json()),
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city2)}&appid=${apiKey}&units=${units}`).then(r => r.json())
    ]);
    
    const comparisonResult = document.getElementById('comparisonResult');
    comparisonResult.innerHTML = `
      <div class="comparison-cards">
        <div class="comparison-card">
          <h4>${data1.name}, ${data1.sys.country}</h4>
          <img src="https://openweathermap.org/img/wn/${data1.weather[0].icon}@2x.png" alt="${data1.weather[0].description}" />
          <div class="comparison-temp">${data1.main.temp.toFixed(1)}${tempUnit}</div>
          <div class="comparison-desc">${data1.weather[0].description}</div>
          <div class="comparison-details">
            <div>Humidity: ${data1.main.humidity}%</div>
            <div>Wind: ${data1.wind.speed.toFixed(1)} ${isMetric ? 'm/s' : 'mph'}</div>
            <div>Pressure: ${data1.main.pressure} hPa</div>
          </div>
        </div>
        
        <div class="comparison-vs">VS</div>
        
        <div class="comparison-card">
          <h4>${data2.name}, ${data2.sys.country}</h4>
          <img src="https://openweathermap.org/img/wn/${data2.weather[0].icon}@2x.png" alt="${data2.weather[0].description}" />
          <div class="comparison-temp">${data2.main.temp.toFixed(1)}${tempUnit}</div>
          <div class="comparison-desc">${data2.weather[0].description}</div>
          <div class="comparison-details">
            <div>Humidity: ${data2.main.humidity}%</div>
            <div>Wind: ${data2.wind.speed.toFixed(1)} ${isMetric ? 'm/s' : 'mph'}</div>
            <div>Pressure: ${data2.main.pressure} hPa</div>
          </div>
        </div>
      </div>
      
      <div class="comparison-summary">
        <h4>Comparison Summary</h4>
        <div class="summary-item">
          Temperature difference: ${Math.abs(data1.main.temp - data2.main.temp).toFixed(1)}${tempUnit}
        </div>
        <div class="summary-item">
          ${data1.main.temp > data2.main.temp ? data1.name : data2.name} is warmer
        </div>
        <div class="summary-item">
          Humidity difference: ${Math.abs(data1.main.humidity - data2.main.humidity)}%
        </div>
      </div>
    `;
    
  } catch (error) {
    alert('Error comparing cities: ' + error.message);
  }
}

/**
 * Toggles between light and dark themes.
 */
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDarkTheme = document.body.classList.contains('dark-theme');
  
  if (isDarkTheme) {
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Theme';
    // Set consistent dark background
    document.body.style.background = WeatherTheme.palette.dark.background;
  } else {
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Theme';
    // Set default light background
    document.body.style.background = WeatherTheme.palette.light.background;
  }
  
  // Save theme preference
  localStorage.setItem('darkTheme', isDarkTheme);
  
  // Remove existing dynamic styles so they can be recreated with new theme colors
  const existingStyles = document.getElementById('weather-card-dynamic-styles');
  if (existingStyles) {
    existingStyles.remove();
  }
  
  // Refresh weather display with new theme if weather data exists
  if (weatherResultDiv.innerHTML.trim() && weatherResultDiv.innerHTML.includes('enhanced-weather-card')) {
    // Re-fetch the current weather data to update the theme
    if (cityInput.value.trim()) {
      const currentCity = cityInput.value.trim();
      // Trigger a refresh of the weather display
      setTimeout(() => {
        if (currentLat && currentLon) {
          getWeatherByCoords(currentLat, currentLon);
        } else {
          getWeather();
        }
      }, 100);
    }
  }
}

/**
 * Add touch feedback for mobile devices
 */
function addTouchFeedback() {
    const buttons = document.querySelectorAll('button, .recent-city');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * Smooth scroll for mobile horizontal scrolling
 */
function initializeSmoothScroll() {
    const hourlyCards = document.querySelector('.hourly-cards');
    if (hourlyCards) {
        let isDown = false;
        let startX;
        let scrollLeft;

        hourlyCards.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - hourlyCards.offsetLeft;
            scrollLeft = hourlyCards.scrollLeft;
        });

        hourlyCards.addEventListener('mouseleave', () => {
            isDown = false;
        });

        hourlyCards.addEventListener('mouseup', () => {
            isDown = false;
        });

        hourlyCards.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - hourlyCards.offsetLeft;
            const walk = (x - startX) * 2;
            hourlyCards.scrollLeft = scrollLeft - walk;
        });
    }
}

/**
 * Add installation prompt for PWA-like experience
 */
function initializePWAPrompt() {
    // Check if the app is running in standalone mode (added to home screen)
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
        document.body.classList.add('standalone-mode');
    }
}

/**
 * Optimize performance by lazy loading non-critical features
 */
function optimizePerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Re-initialize components that need resize handling
            if (currentLat && currentLon && weatherMapDiv.style.display !== 'none') {
                loadWeatherMap();
            }
        }, 250);
    });
}

/**
 * Enhanced error handling with user-friendly messages
 */
function handleNetworkError(error) {
    const errorMessages = {
        'Failed to fetch': 'Unable to connect to weather service. Please check your internet connection.',
        'NetworkError': 'Network connection problem. Please try again.',
        'TypeError': 'Service temporarily unavailable. Please try again later.',
        'AbortError': 'Request timed out. Please try again.'
    };
    
    const userMessage = errorMessages[error.name] || error.message || 'An unexpected error occurred. Please try again.';
    return userMessage;
}

// Initialize mobile optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    addTouchFeedback();
    initializeSmoothScroll();
    initializePWAPrompt();
    optimizePerformance();
    
    // Add service worker registration for better caching (optional)
    if ('serviceWorker' in navigator) {
        // Uncomment the next lines if you want to add a service worker
        // navigator.serviceWorker.register('./sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    }
});