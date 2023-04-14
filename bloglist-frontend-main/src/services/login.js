//import PropTypes from "prop-types";
import axios from "axios";
const baseUrl = "/api/login";

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

/*login
  .propTypes = {
    credentials:  PropTypes.exact({
      username: PropTypes.string,
      password: PropTypes.string
    }).isRequired
  };*/

export default { login };