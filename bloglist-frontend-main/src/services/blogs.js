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
  let response = undefined;
  try {
    response = await axios.put(`${baseUrl}/${id}`, updates, config);
  } catch (error) {
    return error.response.status;
  }
  return response.status;
};

const remove = async (id) => {
  const config = { headers: { Authorization: token } };
  let response = undefined;
  try {
    response = await axios.delete(`${baseUrl}/${id}`, config);
  } catch (error) {
    return error.response.status;
  }
  return response.status;
};

const create = async (newObject) => {
  const config = { headers: { Authorization: token } };

  try {
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    return error.response.data.error === "login expired" ? null : undefined;
  }
};

export default { getAll, setToken, create, update, remove };
