import axios from "axios";
import { getAuthHeader } from "./auth-header";

const API_URL = process.env.RAZZLE_API_URL;

class PaperService {
  getPap() {
    return axios
      .get(`${API_URL}/papers/all`, {
        headers: { ...getAuthHeader() },
      })
      .then((response) => {
        return response.data;
      });
  }
  addPaper(newPaper) {
    return axios
      .post(
        `${API_URL}/papers`,
        {
          ...newPaper,
        },
        {
          headers: { ...getAuthHeader() },
        }
      )
      .then((response) => {
        return response.data;
      });
  }
  updPaper(id, name) {
    return axios
      .put(
        `${API_URL}/papers/${id}`,
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
  uplFile(id, file) {
    console.log(id, formData);
    const formData = new FormData();
    formData.append("file", file);
    return axios({
      method: "PUT",
      url: `${API_URL}/papers/${id}/upload`,
      data: formData,
      headers: {
        // "Content-Type": "multipart/form-data",
        ...getAuthHeader(),
      },
    }).then((response) => {
      return response.data;
    });
  }
  delPaper(id) {
    return axios
      .delete(`${API_URL}/papers/${id}`, {
        headers: { ...getAuthHeader() },
      })
      .then((response) => {
        return response.data;
      });
  }
  delFile(id, file) {
    return axios
      .delete(
        `${API_URL}/papers/${id}/del-file?fileName=${file.fileName}&fileDest=${file.fileDest}`,
        {
          headers: { ...getAuthHeader() },
        }
      )
      .then((response) => {
        return response.data;
      });
  }
  dwnFile(file) {
    console.log(file.fileDest);
    return axios({
      method: "POST",
      url: `${file.fileUrl}`,
      data: {
        path: file.fileDest,
        mime: file.fileMime,
      },
      responseType: "arraybuffer",
    }).then((response) => {
      return response;
    });
  }
}

export default new PaperService();
