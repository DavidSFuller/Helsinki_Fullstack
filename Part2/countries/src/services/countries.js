import axios from 'axios'
const baseUrl = 'https://restcountries.com/v3.1'

const getCountries = () => {
  const request = axios.get(baseUrl+'/all')
   return request.then(response => response.data)
}

const countryService = {getCountries}

export default countryService
