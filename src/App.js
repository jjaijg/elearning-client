import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import "jquery";
import "popper.js";
import "react-loading-skeleton/dist/skeleton.css";
import "./App.css";
import AppBar from "./components/AppBar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

const App = () => {
  const [adminOption, setAdminOption] = useState("departments");

  return (
    <>
      <AppBar adminOption={adminOption} setAdminOption={setAdminOption} />
      <main className="my-3">
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route
            exact={true}
            path="/admin/dashboard"
            render={(props) => <Admin adminOption={adminOption} {...props} />}
          />
        </Switch>
      </main>
    </>
  );
};

export default App;
