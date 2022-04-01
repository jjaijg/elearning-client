import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import "jquery";
import "popper.js";
import "react-loading-skeleton/dist/skeleton.css";
import "react-circular-progressbar/dist/styles.css";
import "./App.css";
import AppBar from "./components/AppBar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import { PrivateRoute } from "./components/PrivateRoute";
import authService from "./services/auth.service";

const App = () => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [adminOption, setAdminOption] = useState("departments");

  useEffect(() => {
    setCurrentUser();
  }, []);

  async function setCurrentUser() {
    try {
      const res = await authService.getCurrentUser();
      console.log(res.data.user);
      const userDetails = await res.data.user;

      if (userDetails) {
        const { tokens, ...userData } = userDetails;
        localStorage.setItem(
          "accessToken",
          JSON.stringify(tokens.slice(-1)[0].token)
        );
        localStorage.setItem("user", JSON.stringify({ ...userData }));
        setAccessToken(tokens.slice(-1)[0].token);
        setUser(userData);
      } else {
        setAccessToken(null);
        setUser(null);
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(null);
    }
  }

  async function logout() {
    try {
      await authService.logout();
      await setCurrentUser();
    } catch (error) {
      console.error(error);
    }
  }

  const updateAdminOption = (opt) => {
    // localStorage.setItem("adminOption", opt);
    setAdminOption(opt);
  };

  return (
    <>
      <AppBar
        user={user}
        adminOption={adminOption}
        setAdminOption={updateAdminOption}
        logout={logout}
      />
      <main className="my-3">
        <Switch>
          <Route exact={true} path="/" component={Home} />
          {/* <Route exact={true} path="/login" component={AdminLogin} /> */}
          {/* <Route
            exact={true}
            path="/admin/dashboard"
            component={(props) => (
              <Admin
                adminOption={adminOption}
                setAdminOption={setAdminOption}
                {...props}
              />
            )}
          /> */}
          <PrivateRoute
            exact={true}
            path="/login"
            user={user}
            token={accessToken}
            component={(props) => (
              <AdminLogin
                setAccessToken={setAccessToken}
                setUser={setUser}
                {...props}
              />
            )}
          />
          <PrivateRoute
            exact={true}
            path="/admin/dashboard"
            user={user}
            token={accessToken}
            component={(props) => (
              <Admin
                adminOption={adminOption}
                setAdminOption={setAdminOption}
                {...props}
              />
            )}
          />
        </Switch>
      </main>
    </>
  );
};

export default App;
