import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RepositorySelection from "./repository-selection/repository-selection";
import RepositoryManagement from "./repository-management/repository-management";

import Loader from "../components/loader/loader";

import { getImportedRepositories } from "../actions";

import "./app.css";

function App({ repositories, dispatch }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(getImportedRepositories());
  }, []);

  useEffect(() => {
    if (repositories) {
      setLoading(false);
    }
  }, [repositories]);

  return loading ? (
    <div className="app">
      <Loader />
    </div>
  ) : (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={RepositorySelection} />
          <Route
            exact
            path="/repository-management"
            component={RepositoryManagement}
          />
        </Switch>
      </Router>
    </div>
  );
}

function mapStateToProps(state) {
  const { repositories } = state;
  return { repositories };
}

export default connect(mapStateToProps)(App);
