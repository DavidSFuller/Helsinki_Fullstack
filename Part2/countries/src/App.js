import { useState, useEffect } from 'react'
import Countries               from './components/Countries'
import Detail                  from './components/Detail'
import Filter                  from './components/Filter'
import countryService          from './services/countries'

function App() {
  
  // State Variables
  const [countries, setCountries] = useState([])
  const [nameFilter, setNameFilter] = useState('')

  // Event Handlers
  const handleFilterChange = (event) => setNameFilter(event.target.value)
  const setCountry = (name) => setNameFilter(name)
  
  useEffect(() => {
    countryService
      .getCountries()
      .then(countries => setCountries(countries))
      
  },[])
    
  // Other functions
  const namesToShow = (nameFilter === '')
    ? null
    : countries.filter(country => country.name.common.toLowerCase().includes(nameFilter.toLowerCase()) )

  const countryList = namesToShow
  console.log('setCountry:',setCountry)
  console.log('countryList:',countryList)

  return (
      <div>
          <h1>Country Information</h1>
          <Filter value={nameFilter} onChange={handleFilterChange} />
          {!countryList ? 'Please filter the country list' : 
           countryList.length===0 ? 'No country found' :
           countryList.length>10 ? 'To many matches. Improve the filter condition' :
           countryList.length===1 ? (<Detail country={countryList[0]} />)
                                  : (<Countries countries={countryList} onClick={setCountry} />)
          }
      </div>
      )  
}

export default App;
