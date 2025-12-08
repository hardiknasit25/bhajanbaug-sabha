import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { AUTH_TOKEN } from "~/constant/constant";
import cookieService from "~/lib/cookie";

// const BASE_URL = "http://172.17.0.49:6111/api/v1/"; // hari vaghasiya IP address
// const BASE_URL = "http://192.168.195.252:6111/api/v1/"; // local laptop IP address
const BASE_URL = "http://172.17.0.66:6111/api/v1/"; // local vrutti PC IP address

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-Custom-Header": "foobar",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // Example: Add auth token
    const token = cookieService.getItem(AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function onFulfilled(response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function onRejected(error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.error("Response error:", error.message);

    // Handle specific status codes
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      cookieService.removeItem(AUTH_TOKEN);
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
