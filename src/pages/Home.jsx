import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const FileSaver = require("file-saver");
import axios from "axios";
import FileTable from "../components/FileTable";

const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSem, setSelectedSem] = useState(null);
  const [papers, setPapers] = useState([]);

  const [deptLoading, setDeptLoading] = useState(false);
  const [semLoading, setSemLoading] = useState(false);
  // const [paperLoading, setPaperLoading] = useState(false);

  useEffect(() => {
    setDeptLoading(true);
    axios.get(`${process.env.RAZZLE_API_URL}/departments`).then((response) => {
      console.log(response);
      setDepartments(response.data);
      setDeptLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedDept) {
      setSemLoading(true);
      axios
        .get(`${process.env.RAZZLE_API_URL}/semesters/dept/${selectedDept.id}`)
        .then((response) => {
          setSemesters(response.data);
          setSemLoading(false);
        });
    } else {
      setSelectedSem(null);
    }
  }, [selectedDept]);

  useEffect(() => {
    if (selectedSem) {
      setPapers(selectedSem.papers);
    } else {
      setPapers([]);
    }
  }, [selectedSem]);

  useEffect(() => {
    if (!semesters.length) {
      setSelectedSem(null);
    }
  }, [semesters]);

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
          <h4 className="card-title">Choose Department and Semester</h4>
          {deptLoading ? (
            <Skeleton />
          ) : (
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
              {!selectedDept && (
                <small id="deptHelp" className="form-text text-muted">
                  Choose your department
                </small>
              )}
            </div>
          )}
          {semesters.length > 0 ? (
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
              {!selectedSem && (
                <small id="deptHelp" className="form-text text-muted">
                  Choose your semester
                </small>
              )}
            </div>
          ) : (
            semLoading && <Skeleton />
          )}
        </div>
      </div>
      {semLoading ? (
        <Skeleton count={10} />
      ) : (
        <FileTable
          papers={papers}
          downloadFile={downloadFile}
          selectedDept={selectedDept}
          selectedSem={selectedSem}
        />
      )}
    </div>
  );
};

export default Home;
