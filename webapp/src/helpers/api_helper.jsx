import axios from "axios";
import authHeader from "./jwt-token-access/auth-token-header";
//apply base url for axios
const API_URL = `${import.meta.env.VITE_API_URL}`;

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export async function get(url, config = {}) {
  const token = authHeader();
  return await axiosApi
    .get(url, { ...config, headers: token })
    .then((response) => response.data);
}

export async function post(url, data, config = {}) {
  const token = authHeader();
  return axiosApi
    .post(url, { ...data }, { ...config, headers: token })
    .then((response) => response.data);
}

export async function put(url, data, config = {}) {
  const token = authHeader();
  return axiosApi
    .put(url, { ...data }, { ...config, headers: token })
    .then((response) => response.data);
}

export async function del(url, config = {}) {
  const token = authHeader();
  return await axiosApi
    .delete(url, { ...config, headers: token })
    .then((response) => response.data);
}
