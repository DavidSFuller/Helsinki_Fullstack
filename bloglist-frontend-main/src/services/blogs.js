import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const update = async (id, updates) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.put(`${baseUrl}/${id}`, updates, config);
  return response.data;
};

const remove = async (id, updates) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.status;
};

const create = async (newObject) => {
  const config = { headers: { Authorization: token } };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, create, update, remove };
