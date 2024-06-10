import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_API_KEY;
  console.log(api_key)

  const handleChange = (event) => {
    setValue(event.target.value)
  }


  const onSearch = (event) => {
    event.preventDefault()
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        const allCountries = response.data
        const reducedCountries = allCountries.filter(c => {
          return (
            c.name.common.toLowerCase().includes(value.toLowerCase())
          )
        }
        )

        setCountries(reducedCountries)
        console.log(reducedCountries)
      })
  }

  const soloCountry = (country) => setCountries([country])

  const getWeather = ({ lat, lon }) => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }

  useEffect(() => {
    if (countries.length === 1) {
      const lat = countries[0].capitalInfo.latlng[0];
      const lon = countries[0].capitalInfo.latlng[1];
      getWeather({ lat, lon });
    }
  }, [countries])


  const renderCountryInfo = () => {
    if (countries.length === 1) {
      return (
        <div>
          <h2>{countries[0].name.common}</h2>
          <div>capital {countries[0].capital}</div>
          <div>area {countries[0].area}</div>
          <h3>languages:</h3>
          <ul>
            {Object.values(countries[0].languages).map(l => <li key={l}>{l}</li>)}
          </ul>
          <img src={countries[0].flags.png} />
          <h3>Weather in {countries[0].capital}</h3>
          {weather && weather.main && (
            <>
              <div>Temperature {weather.main.temp}</div>
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
              <div>wind {weather.wind.speed} m/s</div>
            </>
          )}

        </div>


      )
    }

    if (countries.length > 1) {
      return countries.map(c =>
        <div key={c.name.common} className="country-item">
          {c.name.common}
          <button onClick={() => soloCountry(c)}>show</button>
        </div>
      )
    }
  }

  return (
    <div className="container">
      <div className="search">
        <form onSubmit={onSearch}>
          <h2>Find countries</h2> <input value={value} onChange={handleChange} />
          <button type="submit">submit</button>
        </form>
      </div>
      <div className="info">
        {renderCountryInfo()}
      </div>
    </div>
  )


}

export default App