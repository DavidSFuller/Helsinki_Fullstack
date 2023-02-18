
const Country = ({country, onClick}) => {
        return (
          <div>
            {country.name.common + ' '}
            <button onClick={()=>onClick(country.name.common)}>Show</button>
          </div>
      )
    }

const Countries = ({countries, onClick}) => {
    return (
        <div>
            {countries.map(country =>
                <Country
                    key={country.name.common}
                    country={country} onClick={onClick}
                />)}
        </div>
      )
  }
    
export default Countries