import axios from "axios";
import toast from "react-hot-toast";

function useClient() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

  const Client = axios.create({
    baseURL: `${API_BASE_URL}`,
  });

  Client.interceptors.request.use(
    (config) => {
      return config;
    },
    (err) => {
      toast.error(err.message);
      return false;
    }
  );

  Client.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      toast.error(err.message);
      return false;
    }
  );

  return Client;
}

export default useClient;
