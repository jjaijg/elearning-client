import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import authService from "../services/auth.service";
// import { history } from "./../helpers/history";

const AdminLogin = ({ setUser, setAccessToken, history, location }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      if (!username.trim() || !password.trim()) return;
      await authService.login(username, password);
      setUser(localStorage.getItem("user"));
      setAccessToken(localStorage.getItem("accessToken"));
      console.log("from : ", location.state?.from.pathname);
      history.push(location.state?.from.pathname || "/");
    } catch (err) {
      console.log("err : ", err);
      toast.error(err.response?.data.message || err.statusText);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-title text-center">Admin Login</div>
        <div className="card-body">
          <form onSubmit={onLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // aria-describedby="username-help"
              />
              {/* <div id="username-help" className="form-text">
                We'll never share your email with anyone else.
              </div> */}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* <div className="mb-3 form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
  </div> */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!username || !password}
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminLogin;
