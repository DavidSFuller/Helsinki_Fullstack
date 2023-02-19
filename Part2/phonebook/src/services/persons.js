import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const remove = id => {
  const removeThis = baseUrl + '/' + id
  console.log('remove:', removeThis)
  const request = axios.delete(removeThis)
  return request.then(response => response.data)
}

const update = (id, person) => {
  const updateThis = baseUrl + '/' + id
  console.log('update:', updateThis,'to',person)
  const request = axios.put(updateThis, person)
  return request.then(response => response.data)
}

const personService = {getAll, create, remove, update}

export default personService
