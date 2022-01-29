import React from "react";
import { Link } from "react-router-dom";

const AppBar = ({ adminOption, setAdminOption }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-1">
      <a className="navbar-brand" href="#">
        ELearning
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to={"/"}>
              Home
            </Link>
          </li>
          <li
            className="nav-item"
            onClick={() => setAdminOption("departments")}
          >
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
      </div>
    </nav>
  );
};

export default AppBar;
