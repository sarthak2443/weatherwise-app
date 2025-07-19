/**
 * Modern WeatherCard Component
 * Follows the structure and styling from the provided example
 */

/**
 * Enhanced WeatherCard with modern theme system
 * @param {Object} weatherData - Complete weather data object from API
 * @returns {string} HTML string for the enhanced weather card
 */
function createEnhancedWeatherCard(weatherData) {
  const theme = WeatherTheme.getCurrentTheme();
  const colors = WeatherTheme.palette[theme];
  const { typography, spacing, radii, shadow } = WeatherTheme;
  
  // Extract data from weatherData object (OpenWeatherMap format)
  const {
    name: city,
    sys: { country, sunrise, sunset } = {},
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure } = {},
    weather: [{ main: condition, description, icon: weatherIcon }] = [{}],
    wind: { speed: windSpeed } = {},
    visibility,
    coord: { lat, lon } = {}
  } = weatherData;
  
  // Helper function to get icon URL
  const getIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };
  
  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return `
    <div class="enhanced-weather-card card" 
         style="
           background: ${colors.card};
           color: ${colors.text};
           border-radius: ${radii.card};
           box-shadow: ${theme === 'dark' ? shadow.cardDark : shadow.card};
           transition: ${shadow.transition};
           max-width: 420px;
           margin: auto;
           position: relative;
           overflow: hidden;
         "
         role="region"
         aria-label="Current weather for ${city}, ${country}">
      
      <!-- Card Header Accent -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, #f093fb, #f5576c);
        border-radius: ${radii.card} ${radii.card} 0 0;
      "></div>
      
      <div style="padding: ${spacing.lg};">
        <!-- Header Section -->
        <div class="weather-header" 
             style="
               display: flex;
               align-items: center;
               gap: ${spacing.lg};
               margin-bottom: ${spacing.xl};
               flex-wrap: wrap;
               justify-content: center;
             ">
          
          <img src="${getIconUrl(weatherIcon)}" 
               alt="${description}" 
               class="weather-icon"
               style="
                 width: clamp(80px, 15vw, 120px);
                 height: clamp(80px, 15vw, 120px);
                 filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
               " />
          
          <div class="location-info" style="text-align: center;">
            <h2 style="
              font-size: ${typography.heading.fontSize};
              font-weight: ${typography.heading.fontWeight};
              line-height: ${typography.heading.lineHeight};
              color: ${colors.text};
              margin: 0 0 ${spacing.xs} 0;
              letter-spacing: -0.025em;
            ">${city}, ${country}</h2>
            
            <p style="
              font-size: ${typography.caption.fontSize};
              color: ${colors.muted};
              font-weight: 500;
              margin: 0;
            ">
              ${lat?.toFixed(2)}°, ${lon?.toFixed(2)}°
            </p>
          </div>
        </div>

        <!-- Temperature Section -->
        <div class="temperature-section" 
             style="
               background: linear-gradient(135deg, 
                 ${theme === 'dark' 
                   ? 'rgba(102, 126, 234, 0.2)' 
                   : 'rgba(102, 126, 234, 0.1)'}, 
                 ${theme === 'dark' 
                   ? 'rgba(118, 75, 162, 0.2)' 
                   : 'rgba(118, 75, 162, 0.1)'});
               border-radius: ${radii.lg};
               padding: ${spacing.lg};
               margin-bottom: ${spacing.lg};
               border: 1px solid ${colors.border};
               text-align: center;
             ">
          
          <div style="
            font-size: ${typography.temperature.fontSize};
            font-weight: ${typography.temperature.fontWeight};
            line-height: ${typography.temperature.lineHeight};
            background: linear-gradient(135deg, #f093fb, #f5576c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: ${spacing.sm};
          ">${Math.round(temp)}°</div>
          
          <div style="
            font-size: ${typography.bodyLarge.fontSize};
            color: ${colors.muted};
            margin-bottom: ${spacing.md};
            font-weight: 500;
          ">Feels like ${Math.round(feels_like)}°</div>
          
          <div style="
            font-size: ${typography.subheading.fontSize};
            color: ${colors.text};
            text-transform: capitalize;
            font-weight: 600;
            letter-spacing: 0.5px;
          ">${condition} - ${description}</div>
        </div>

        <!-- Weather Details Grid -->
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: ${spacing.md};
          margin-bottom: ${spacing.lg};
        ">
          
          <!-- Temperature Range -->
          <div style="
            background: ${colors.surface};
            padding: ${spacing.md};
            border-radius: ${radii.md};
            border: 1px solid ${colors.border};
            text-align: center;
            transition: ${shadow.transition};
          " class="detail-card">
            <div style="color: ${colors.primary}; margin-bottom: ${spacing.xs};">
              <i class="fas fa-thermometer-half"></i>
            </div>
            <div style="
              font-size: ${typography.bodyLarge.fontSize};
              font-weight: 600;
              color: ${colors.text};
              margin-bottom: 2px;
            ">
              <span style="color: #f5576c;">${Math.round(temp_max)}°</span>
              <span style="margin: 0 4px; color: ${colors.muted};">|</span>
              <span style="color: #4facfe;">${Math.round(temp_min)}°</span>
            </div>
            <div style="font-size: ${typography.caption.fontSize}; color: ${colors.muted};">
              High / Low
            </div>
          </div>

          <!-- Humidity -->
          <div style="
            background: ${colors.surface};
            padding: ${spacing.md};
            border-radius: ${radii.md};
            border: 1px solid ${colors.border};
            text-align: center;
            transition: ${shadow.transition};
          " class="detail-card">
            <div style="color: ${colors.primary}; margin-bottom: ${spacing.xs};">
              <i class="fas fa-tint"></i>
            </div>
            <div style="
              font-size: ${typography.bodyLarge.fontSize};
              font-weight: 600;
              color: ${colors.text};
              margin-bottom: 2px;
            ">${humidity}%</div>
            <div style="font-size: ${typography.caption.fontSize}; color: ${colors.muted};">
              Humidity
            </div>
          </div>

          <!-- Wind Speed -->
          <div style="
            background: ${colors.surface};
            padding: ${spacing.md};
            border-radius: ${radii.md};
            border: 1px solid ${colors.border};
            text-align: center;
            transition: ${shadow.transition};
          " class="detail-card">
            <div style="color: ${colors.primary}; margin-bottom: ${spacing.xs};">
              <i class="fas fa-wind"></i>
            </div>
            <div style="
              font-size: ${typography.bodyLarge.fontSize};
              font-weight: 600;
              color: ${colors.text};
              margin-bottom: 2px;
            ">${windSpeed?.toFixed(1) || 'N/A'}</div>
            <div style="font-size: ${typography.caption.fontSize}; color: ${colors.muted};">
              Wind (${isMetric ? 'm/s' : 'mph'})
            </div>
          </div>

          <!-- Pressure -->
          <div style="
            background: ${colors.surface};
            padding: ${spacing.md};
            border-radius: ${radii.md};
            border: 1px solid ${colors.border};
            text-align: center;
            transition: ${shadow.transition};
          " class="detail-card">
            <div style="color: ${colors.primary}; margin-bottom: ${spacing.xs};">
              <i class="fas fa-compress-arrows-alt"></i>
            </div>
            <div style="
              font-size: ${typography.bodyLarge.fontSize};
              font-weight: 600;
              color: ${colors.text};
              margin-bottom: 2px;
            ">${pressure}</div>
            <div style="font-size: ${typography.caption.fontSize}; color: ${colors.muted};">
              Pressure (hPa)
            </div>
          </div>

          ${visibility ? `
          <!-- Visibility -->
          <div style="
            background: ${colors.surface};
            padding: ${spacing.md};
            border-radius: ${radii.md};
            border: 1px solid ${colors.border};
            text-align: center;
            transition: ${shadow.transition};
          " class="detail-card">
            <div style="color: ${colors.primary}; margin-bottom: ${spacing.xs};">
              <i class="fas fa-eye"></i>
            </div>
            <div style="
              font-size: ${typography.bodyLarge.fontSize};
              font-weight: 600;
              color: ${colors.text};
              margin-bottom: 2px;
            ">${(visibility / 1000).toFixed(1)}</div>
            <div style="font-size: ${typography.caption.fontSize}; color: ${colors.muted};">
              Visibility (km)
            </div>
          </div>
          ` : ''}

          ${sunrise && sunset ? `
          <!-- Sun Times -->
          <div style="
            background: ${colors.surface};
            padding: ${spacing.md};
            border-radius: ${radii.md};
            border: 1px solid ${colors.border};
            text-align: center;
            transition: ${shadow.transition};
            grid-column: span 2;
          " class="detail-card sun-times">
            <div style="
              display: flex;
              justify-content: space-around;
              align-items: center;
              gap: ${spacing.lg};
            ">
              <div style="text-align: center;">
                <div style="color: ${colors.primary}; margin-bottom: ${spacing.xs};">
                  <i class="fas fa-sun"></i>
                </div>
                <div style="
                  font-size: ${typography.body.fontSize};
                  font-weight: 600;
                  color: ${colors.text};
                  margin-bottom: 2px;
                ">${formatTime(sunrise)}</div>
                <div style="font-size: ${typography.caption.fontSize}; color: ${colors.muted};">
                  Sunrise
                </div>
              </div>
              
              <div style="
                width: 1px;
                height: 40px;
                background: ${colors.divider};
              "></div>
              
              <div style="text-align: center;">
                <div style="color: ${colors.primary}; margin-bottom: ${spacing.xs};">
                  <i class="fas fa-moon"></i>
                </div>
                <div style="
                  font-size: ${typography.body.fontSize};
                  font-weight: 600;
                  color: ${colors.text};
                  margin-bottom: 2px;
                ">${formatTime(sunset)}</div>
                <div style="font-size: ${typography.caption.fontSize}; color: ${colors.muted};">
                  Sunset
                </div>
              </div>
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Make the function available globally
window.createEnhancedWeatherCard = createEnhancedWeatherCard;