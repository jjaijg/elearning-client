import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

export const PrivateRoute = ({
  component: Component,
  user,
  token,
  ...rest
}) => {
  // const user = localStorage.getItem("user");

  return (
    <Route
      {...rest}
      render={(props) => {
        console.log("props : ", props.location);
        if (!user && props.location.pathname === "/login") {
          console.log("Authetication required!!!");
          return <Component {...props} />;
        } else if (user && props.location.pathname === "/login") {
          if (props.location.state?.from.pathname) {
            console.log(
              "Redirecting to : ",
              props.location.state?.from.pathname
            );
            return (
              <Redirect
                to={{ pathname: props.location.state?.from.pathname }}
              />
            );
          }
          console.log("You already logged in, so redirecting you to home!");
          return <Redirect to={{ pathname: "/" }} />;
        } else if (user) {
          console.log("You already logged in!!!");
          return <Component {...props} />;
        }
        console.log("Let's authenticate!!!");
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }}
    />
  );
};
