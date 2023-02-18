const Detail = ({country}) => {
    const imgStyle ={border:"1px solid black"}
    return(
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital}<br/>Area: {country.area}</p>
            <h3>Languages:</h3>
            <div>
               <ul>
                    {Object.entries(country.languages)
                        .map(([key, value], index) => (
                            <li key={index}>{value}</li>))}
                </ul>
            </div>
            <img style={imgStyle} src={country.flags['png']} alt="{country.name.common}"></img>
        </div>
    )
}

export default Detail