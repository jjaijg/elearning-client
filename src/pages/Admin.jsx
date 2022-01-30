import React, { useEffect, useState } from "react";
import axios from "axios";
import DepartmentBoard from "../components/DepartmentBoard";
import { ToastContainer } from "react-toastify";
import SemesterBoard from "../components/SemesterBoard";
import PaperBoard from "../components/PaperBoard";

const Admin = ({ adminOption, setAdminOption }) => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isChanged, setIsChanged] = useState(true);

  const getAllData = async () => {
    setLoading(true);
    const deptRes = await axios.get(
      `${process.env.RAZZLE_API_URL}/departments`
    );
    setDepartments(deptRes.data);
    const semRes = await axios.get(
      `${process.env.RAZZLE_API_URL}/semesters/with-dept`
    );
    setSemesters(semRes.data);
    const papRes = await axios.get(`${process.env.RAZZLE_API_URL}/papers/all`);
    setPapers(papRes.data);
    setLoading(false);
  };

  const getData = async (url, setter) => {
    const res = await axios.get(url);
    setter(res.data);
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    if (isChanged) {
      setLoading(true);
      axios.get(`${process.env.RAZZLE_API_URL}/departments`).then((res) => {
        setDepartments(res.data);
        setLoading(false);
      });
      setIsChanged(false);
    }
  }, [isChanged]);

  useEffect(() => {
    if (isChanged && adminOption === "departments") {
      getData(`${process.env.RAZZLE_API_URL}/departments`, setDepartments);
    } else if (isChanged && adminOption === "semesters") {
      getData(
        `${process.env.RAZZLE_API_URL}/semesters/with-dept`,
        setSemesters
      );
    } else if (isChanged && adminOption === "papers") {
      getData(`${process.env.RAZZLE_API_URL}/papers/all`, setPapers);
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
          >
            Departments
          </span>
        </li>
        <li className="nav-item" onClick={() => setAdminOption("semesters")}>
          <span
            className={`${
              adminOption === "semesters" ? "active" : ""
            } nav-link`}
          >
            Semesters
          </span>
        </li>
        <li className="nav-item" onClick={() => setAdminOption("papers")}>
          <span
            className={`${adminOption === "papers" ? "active" : ""} nav-link`}
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
              setSuccess={setSuccess}
              setError={setError}
              setProcessed={setIsChanged}
            />
          )}
          {adminOption === "semesters" && (
            <SemesterBoard
              departments={departments}
              semesters={semesters}
              loading={loading}
              setSuccess={setSuccess}
              setError={setError}
              setProcessed={setIsChanged}
            />
          )}
          {adminOption === "papers" && (
            <PaperBoard
              departments={departments}
              semesters={semesters}
              papers={papers}
              loading={loading}
              setSuccess={setSuccess}
              setError={setError}
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
