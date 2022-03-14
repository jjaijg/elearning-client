import axios from "axios";
import { getAuthHeader } from "./auth-header";

const API_URL = process.env.RAZZLE_API_URL;

class SemesterService {
  getSemWithDept() {
    return axios
      .get(`${API_URL}/semesters/with-dept`, {
        headers: { ...getAuthHeader() },
      })
      .then((response) => {
        return response.data;
      });
  }
  getSemByDept(deptId) {
    return axios
      .get(`${API_URL}/semesters/dept/${deptId}`, {
        headers: { ...getAuthHeader() },
      })
      .then((response) => {
        return response.data;
      });
  }
  addSem(newSem) {
    return axios
      .post(
        `${API_URL}/semesters`,
        {
          ...newSem,
        },
        {
          headers: { ...getAuthHeader() },
        }
      )
      .then((response) => {
        return response.data;
      });
  }
  updSem(id, updatedSem) {
    return axios
      .put(
        `${API_URL}/semesters/${id}`,
        {
          ...updatedSem,
        },
        {
          headers: { ...getAuthHeader() },
        }
      )
      .then((response) => {
        return response.data;
      });
  }
  delSem(id) {
    return axios
      .delete(`${API_URL}/semesters/${id}`, {
        headers: { ...getAuthHeader() },
      })
      .then((response) => {
        return response.data;
      });
  }
}

export default new SemesterService();
