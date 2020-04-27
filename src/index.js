import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RepositorySelection from "./RepositorySelection";
import RepositoryManagement from "./RepositoryManagement";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={RepositorySelection} />
        <Route exact path="/repository-management" component={RepositoryManagement} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
