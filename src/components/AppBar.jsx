import React from "react";
import { Link } from "react-router-dom";

const AppBar = ({}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-1">
      <a className="navbar-brand" href="#">
        ELearning
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#app-bar"
        aria-controls="app-bar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="app-bar">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to={"/"}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/admin/dashboard"}>
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AppBar;
