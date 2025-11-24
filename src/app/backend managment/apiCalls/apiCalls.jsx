import { getCookie } from "@jumbo/utilities/cookies";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

function setAuthHeader() {
  const cookieStr = (getCookie("auth-user"));
  let authUser = null;
  if (cookieStr) {
    try {
      authUser = JSON.parse(decodeURIComponent(cookieStr));
    } catch (err) {
      console.error("Invalid auth-user cookie", err);
    }
  }
  const token = authUser?.token;
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

export function postRequest(url, params = {}, callback, errorCallback) {
  setAuthHeader();
  axios
    .post(`${API_BASE_URL}${url}`, params)
    .then((res) => callback && callback(res))
    .catch((err) => errorCallback && errorCallback(err));
}

export function getRequest(url, callback, errorCallback) {
  setAuthHeader();
  axios
    .get(`${API_BASE_URL}${url}`)
    .then((res) => callback && callback(res))
    .catch((err) => errorCallback && errorCallback(err));
}

export function putRequest(url, params = {}, callback, errorCallback) {
  setAuthHeader();
  axios
    .put(`${API_BASE_URL}${url}`, params)
    .then((res) => callback && callback(res))
    .catch((err) => errorCallback && errorCallback(err));
}

export function deleteRequest(url, callback, errorCallback) {
  setAuthHeader();
  axios
    .delete(`${API_BASE_URL}${url}`)
    .then((res) => callback && callback(res))
    .catch((err) => errorCallback && errorCallback(err));
}
export async function loginRequest(params) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, params);
  return res.data;
}

export function updateRequest(url, formData, callback, errorCallback) {
  setAuthHeader();
  axios
    .put(`${API_BASE_URL}${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => callback && callback(res))
    .catch((err) => errorCallback && errorCallback(err));
}
export function createRequest(url, formData, callback, errorCallback) {
  setAuthHeader();
  axios
    .post(`${API_BASE_URL}${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => callback && callback(res))
    .catch((err) => errorCallback && errorCallback(err));
}

export async function postRequestAsync(url, params = {}) {
  setAuthHeader();
  try {
    const response = await axios.post(`${API_BASE_URL}${url}`, params);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // allow try/catch handling
  }
}