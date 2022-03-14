import axios from "axios";
import { getAuthHeader } from "./auth-header";

const API_URL = process.env.RAZZLE_API_URL;

class DepartmentService {
  getDept() {
    return axios
      .get(`${API_URL}/departments`, {
        headers: { ...getAuthHeader() },
      })
      .then((response) => {
        return response.data;
      });
  }
  addDept(name) {
    return axios
      .post(
        `${API_URL}/departments`,
        {
          name,
        },
        {
          headers: { ...getAuthHeader() },
        }
      )
      .then((response) => {
        return response.data;
      });
  }
  updDept(id, name) {
    return axios
      .put(
        `${API_URL}/departments/${id}`,
        {
          name,
        },
        {
          headers: { ...getAuthHeader() },
        }
      )
      .then((response) => {
        return response.data;
      });
  }
  delDept(id) {
    return axios
      .delete(`${API_URL}/departments/${id}`, {
        headers: { ...getAuthHeader() },
      })
      .then((response) => {
        return response.data;
      });
  }
}

export default new DepartmentService();
