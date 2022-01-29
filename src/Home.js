import React, { useEffect, useState } from "react";
const FileSaver = require("file-saver");
import axios from "axios";
import { FileIcon, defaultStyles } from "react-file-icon";

const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSem, setSelectedSem] = useState(null);
  const [papers, setPapers] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.RAZZLE_API_URL}/departments`).then((response) => {
      console.log(response);
      setDepartments(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedDept) {
      axios
        .get(`${process.env.RAZZLE_API_URL}/semesters/dept/${selectedDept.id}`)
        .then((response) => {
          setSemesters(response.data);
        });
    }
  }, [selectedDept]);

  useEffect(() => {
    if (selectedSem) {
      setPapers(selectedSem.papers);
    }
  }, [selectedSem]);

  const onDeptChange = (e) => {
    const deptId = e.target.value;
    setSelectedDept({
      id: deptId,
      name: departments.find((dept) => dept._id === deptId).name,
    });
  };
  const onSemChange = (e) => {
    const semId = e.target.value;
    const semPicked = semesters.find((sem) => sem._id === semId);
    setSelectedSem({
      id: semId,
      name: semPicked.name,
      papers: semPicked.papers,
    });
  };

  const downloadFile = (file) => {
    axios
      .post(file.fileUrl, {
        path: file.fileDest,
        mime: file.fileMime,
      })
      .then((res) => {
        var blob = new Blob([res.data], {
          type: file.fileMime,
        });
        FileSaver.saveAs(blob, file.fileName);
      });
  };

  return (
    <div className="container">
      <div className="card mt-2 shadow p-3 mb-5 bg-white rounded">
        <div className="card-body">
          {/* <div className=""></div> */}
          <div className="form-group my-3">
            <label htmlFor="department-list">Department</label>
            <select
              className="form-select mt-2"
              id="department-list"
              aria-label="Department list"
              defaultValue={"--Select Department--"}
              onChange={onDeptChange}
            >
              <option disabled>--Select Department--</option>
              {departments.map((dept) => (
                <option value={dept._id} key={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <small id="deptHelp" className="form-text text-muted">
              Choose your department
            </small>
          </div>
          {semesters.length > 0 && (
            <div className="form-group my-3">
              <label htmlFor="semester-list">Semester</label>
              <select
                className="form-select mt-2"
                id="semester-list"
                aria-label="Semester list"
                defaultValue={"--Select Semester--"}
                onChange={onSemChange}
              >
                <option disabled>--Select Semester--</option>
                {semesters.map((sem) => (
                  <option value={sem._id} key={sem._id}>
                    {sem.name}
                  </option>
                ))}
              </select>
              <small id="deptHelp" className="form-text text-muted">
                Choose your semester
              </small>
            </div>
          )}
        </div>
      </div>
      <div className="shadow p-3 mb-5 bg-white rounded">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Document</th>
              <th scope="col">Paper</th>
              <th scope="col">Semester</th>
              <th scope="col">Department</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {papers?.length ? (
              papers.map((paper, ind) =>
                paper.files.map((file) => (
                  <tr key={file.fileName}>
                    <td>
                      <div className="d-flex flex-row align-items-center">
                        <div style={{ width: "26px" }}>
                          <FileIcon
                            extension={file.fileType}
                            {...defaultStyles[file.fileType]}
                          />
                        </div>

                        <span className="px-1">{file.fileName}</span>
                      </div>
                    </td>
                    <td>{paper.name}</td>
                    <td>{selectedSem.name}</td>
                    <td>{selectedDept.name}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => downloadFile(file)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr className="bg-info">
                <td colSpan={5} className="text-center">
                  No Data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
