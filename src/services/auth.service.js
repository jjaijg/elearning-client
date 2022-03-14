import axios from "axios";
import { getAuthHeader } from "./auth-header";

const API_URL = process.env.RAZZLE_API_URL;

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "/login", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem(
            "accessToken",
            JSON.stringify(response.data.token)
          );
        }

        return response.data;
      });
  }

  logout() {
    return axios
      .post(API_URL + "/logout", {}, { headers: { ...getAuthHeader() } })
      .then((response) => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        return response.data;
      });
  }

  register(username, email, password) {
    return axios.post(API_URL + "/signup", {
      username,
      email,
      password,
    });
  }

  getCurrentUser() {
    return axios.get(API_URL + "/profile", {
      headers: { ...getAuthHeader() },
    });
  }
}

export default new AuthService();
