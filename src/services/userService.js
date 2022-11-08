import axios from "../axios";
const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsersAPi = (inputId) => {
  return axios.get(`/api/list-users?id=${inputId}`);
};

export { handleLoginApi, getAllUsersAPi };
