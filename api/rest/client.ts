import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_REST_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const authStore = await AsyncStorage.getItem("auth-storage");
    if (authStore) {
      const token = JSON.parse(authStore).state.token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
