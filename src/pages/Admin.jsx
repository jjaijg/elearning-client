import React, { useEffect, useState } from "react";
import DepartmentBoard from "../components/DepartmentBoard";
import { ToastContainer } from "react-toastify";
import SemesterBoard from "../components/SemesterBoard";
import PaperBoard from "../components/PaperBoard";
import departmentService from "../services/department.service";
import semesterService from "../services/semester.service";
import paperService from "../services/paper.service";

const Admin = ({ adminOption, setAdminOption }) => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);
  // const [error, setError] = useState(false);
  const [isChanged, setIsChanged] = useState(true);

  const getAllData = async () => {
    try {
      setLoading(true);
      console.log("Getting department data");
      const depts = await departmentService.getDept();
      setDepartments(depts);
      console.log("Getting semester data");
      const sems = await semesterService.getSemWithDept();
      setSemesters(sems);
      console.log("Getting paper data");
      const paps = await paperService.getPap();
      setPapers(paps);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  const getData = async (method, setter) => {
    try {
      const data = await method();
      setter(data);
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    const getDept = async () => {
      try {
        setLoading(true);
        const depts = await departmentService.getDept();
        setDepartments(depts);
        setLoading(false);
        setIsChanged(false);
      } catch (err) {
        console.log("err : ", err);
        toast.error(err.response?.data.message || err.statusText);
      }
    };
    if (isChanged) {
      console.log("things changed, refetching department!");
      getDept();
    }
  }, [isChanged]);

  useEffect(() => {
    if (isChanged && adminOption === "departments") {
      console.log("Getting department page details");
      getData(departmentService.getDept, setDepartments);
    } else if (isChanged && adminOption === "semesters") {
      console.log("Getting semester page details");
      getData(semesterService.getSemWithDept, setSemesters);
    } else if (isChanged && adminOption === "papers") {
      console.log("Getting paper page details");
      getData(paperService.getPap, setPapers);
    }
    setIsChanged(false);
  }, [isChanged, adminOption]);

  return (
    <div className="container">
      <ul className="nav nav-tabs">
        <li className="nav-item" onClick={() => setAdminOption("departments")}>
          <span
            className={`${
              adminOption === "departments" ? "active" : ""
            } nav-link`}
            type="button"
          >
            Departments
          </span>
        </li>
        <li className="nav-item" onClick={() => setAdminOption("semesters")}>
          <span
            className={`${
              adminOption === "semesters" ? "active" : ""
            } nav-link`}
            type="button"
          >
            Semesters
          </span>
        </li>
        <li className="nav-item" onClick={() => setAdminOption("papers")}>
          <span
            className={`${adminOption === "papers" ? "active" : ""} nav-link`}
            type="button"
          >
            Papers
          </span>
        </li>
      </ul>
      <div className="row">
        <div className="col-12">
          {adminOption === "departments" && (
            <DepartmentBoard
              departments={departments}
              loading={loading}
              // setSuccess={setSuccess}
              // setError={setError}
              setProcessed={setIsChanged}
            />
          )}
          {adminOption === "semesters" && (
            <SemesterBoard
              departments={departments}
              semesters={semesters}
              loading={loading}
              // setSuccess={setSuccess}
              // setError={setError}
              setProcessed={setIsChanged}
            />
          )}
          {adminOption === "papers" && (
            <PaperBoard
              departments={departments}
              semesters={semesters}
              papers={papers}
              loading={loading}
              // setSuccess={setSuccess}
              // setError={setError}
              setProcessed={setIsChanged}
            />
          )}
        </div>
      </div>
      <ToastContainer position={"bottom-right"} />
    </div>
  );
};

export default Admin;
