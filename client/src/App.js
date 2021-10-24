import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";

import Nav from "./components/NavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/user/Profile";
import ChangePassword from "./components/user/ChangePassword";

function App() {
  return (
    <React.Fragment>
      <Nav>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoute path="/profile">
            <Profile />
          </PrivateRoute>
          <PrivateRoute path="/change-password">
            <ChangePassword />
          </PrivateRoute>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Nav>
    </React.Fragment>
  );
}

export default App;
