import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { toast, ToastContainer } from "react-toastify";

import FileSaver from "file-saver";
import FileTable from "../components/FileTable";
import departmentService from "../services/department.service";
import semesterService from "../services/semester.service";
import paperService from "../services/paper.service";

const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSem, setSelectedSem] = useState(null);
  const [papers, setPapers] = useState([]);

  const [deptLoading, setDeptLoading] = useState(false);
  const [semLoading, setSemLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  // const [paperLoading, setPaperLoading] = useState(false);

  useEffect(() => {
    const getDept = async () => {
      try {
        setDeptLoading(true);
        const depts = await departmentService.getDept();
        setDepartments(depts);
        setDeptLoading(false);
      } catch (err) {
        setDeptLoading(false);
        console.log("err : ", err);
        toast.error(err.response?.data.message || err.statusText);
      }
    };
    console.log("Getting departments in home page...");
    getDept();
  }, []);

  useEffect(() => {
    const getSem = async () => {
      try {
        setSemLoading(true);
        const sems = await semesterService.getSemByDept(selectedDept.id);
        setSemesters(sems);
        setSemLoading(false);
      } catch (err) {
        setSemLoading(false);
        console.log("err : ", err);
        toast.error(err.response?.data.message || err.statusText);
      }
    };
    if (selectedDept) {
      getSem(selectedDept.id);
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

  const onDownloadProgress = (progressEvent) => {
    var percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setProgress(percentCompleted);
  };
  // };

  const downloadFile = async (file) => {
    try {
      const res = await paperService.dwnFile(file, onDownloadProgress);
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });
      FileSaver.saveAs(blob, file.fileName);
      setProgress(0);
    } catch (err) {
      console.log("err : ", err);
      console.log(
        err.response?.data.message ||
          err.response?.message ||
          err.statusText ||
          err.message
      );
      toast.error(
        `Check if file exists, ${
          err.response?.data.message ||
          err.response?.message ||
          err.statusText ||
          err.message
        }`
      );
      setProgress(0);
    }
  };

  return (
    <div className="container">
      <div className="card mt-2 shadow p-3 mb-5 bg-white rounded">
        <div className="card-body">
          <h4 className="card-title">Choose Course and Semester</h4>
          {deptLoading ? (
            <Skeleton />
          ) : (
            <div className="form-group my-3">
              <label htmlFor="department-list">Course</label>
              <select
                className="form-select mt-2"
                id="department-list"
                aria-label="Course list"
                defaultValue={"--Select Course--"}
                onChange={onDeptChange}
              >
                <option disabled>--Select Course--</option>
                {departments.map((dept) => (
                  <option value={dept._id} key={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {!selectedDept && (
                <small id="deptHelp" className="form-text text-muted">
                  Choose your course
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
          downloadProgress={progress}
        />
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Home;
