import { useState, useEffect } from 'react'

// Coordinates for Karnataka districts
const districtCoords = {
  'Bengaluru': { lat: 12.97, lon: 77.59 },
  'Mysuru': { lat: 12.30, lon: 76.64 },
  'Mangaluru': { lat: 12.84, lon: 74.88 },
  'Hubballi': { lat: 15.36, lon: 75.12 },
  'Belagavi': { lat: 15.86, lon: 74.50 },
  'Kalaburagi': { lat: 17.33, lon: 76.80 },
  'Davangere': { lat: 14.46, lon: 75.92 },
  'Ballari': { lat: 15.14, lon: 76.92 },
  'Shivamogga': { lat: 13.93, lon: 75.56 },
  'Tumakuru': { lat: 13.34, lon: 77.10 },
  'Raichur': { lat: 16.21, lon: 77.35 },
  'Bidar': { lat: 17.91, lon: 77.53 },
  'Hassan': { lat: 13.00, lon: 76.10 },
  'Udupi': { lat: 13.34, lon: 74.88 },
  'Chikkamagaluru': { lat: 13.32, lon: 75.77 }
}

// Convert weather codes to emojis and text
const getWeatherInfo = (code) => {
  if (code === 0) return { text: 'Clear Sky', icon: '☀️' }
  if (code >= 1 && code <= 3) return { text: 'Partly Cloudy', icon: '⛅' }
  if (code >= 45 && code <= 48) return { text: 'Foggy', icon: '🌫️' }
  if (code >= 51 && code <= 55) return { text: 'Light Drizzle', icon: '🌦️' }
  if (code >= 61 && code <= 65) return { text: 'Rain', icon: '🌧️' }
  if (code >= 80 && code <= 82) return { text: 'Heavy Rain Showers', icon: '⛈️' }
  if (code >= 95) return { text: 'Thunderstorm', icon: '⚡' }
  return { text: 'Unknown', icon: '❓' }
}

export default function WeatherDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState('Bengaluru')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchWeather = async (district) => {
    setLoading(true)
    const { lat, lon } = districtCoords[district]
    
    try {
      // Fetching real-time data from Open-Meteo (No API key needed!)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
      )
      const data = await response.json()
      setWeather(data.current)
    } catch (error) {
      console.error("Error fetching weather:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWeather(selectedDistrict)
  }, [selectedDistrict])

  const weatherInfo = weather ? getWeatherInfo(weather.weather_code) : null

  return (
    <div>
      <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
        LIVE DATA INTEGRATION
      </p>
      <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '8px', lineHeight: '1.1' }}>
        Live Weather Dashboard
      </h1>
      <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
        Real-time weather conditions for major Karnataka districts. Helps farmers decide when to spray pesticides or harvest.
      </p>

      {/* DISTRICT SELECTOR */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
          Select District:
        </label>
        <select 
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          style={{ 
            padding: '12px 16px', 
            fontSize: '16px', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db', 
            background: 'white',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '300px'
          }}
        >
          {Object.keys(districtCoords).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* WEATHER DISPLAY */}
      {loading ? (
        <p style={{ fontSize: '18px', color: '#6b7280' }}>Fetching live data...</p>
      ) : weather ? (
        <div>
          {/* Main Temperature Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
            padding: '40px', 
            borderRadius: '16px', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)'
          }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '500' }}>{selectedDistrict}</h2>
              <div style={{ fontSize: '72px', fontWeight: '700', lineHeight: '1' }}>
                {Math.round(weather.temperature_2m)}°C
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '20px', opacity: 0.9 }}>
                {weatherInfo.icon} {weatherInfo.text}
              </p>
            </div>
            <div style={{ fontSize: '100px' }}>
              {weatherInfo.icon}
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <WeatherCard label="Feels Like" value={`${Math.round(weather.apparent_temperature)}°C`} icon="🌡️" />
            <WeatherCard label="Humidity" value={`${weather.relative_humidity_2m}%`} icon="💧" />
            <WeatherCard label="Wind Speed" value={`${weather.wind_speed_10m} km/h`} icon="💨" />
          </div>
        </div>
      ) : (
        <p style={{ color: 'red' }}>Failed to load weather data. Please check your internet connection.</p>
      )}
    </div>
  )
}

function WeatherCard({ label, value, icon }) {
  return (
    <div style={{ 
      background: 'white', 
      padding: '24px', 
      borderRadius: '12px', 
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{ fontSize: '32px' }}>{icon}</div>
      <div>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>{label}</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '20px', color: '#111827', fontWeight: '700' }}>{value}</p>
      </div>
    </div>
  )
}