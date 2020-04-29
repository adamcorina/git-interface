import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RepositorySelection from "./repository-selection/repository-selection";
import RepositoryManagement from "./repository-management/repository-management";

import { getImportedRepositories } from "../actions";

function App({ repositories, dispatch }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getImportedRepositories());
  }, []);

  useEffect(() => {
    if (repositories) {
      setLoading(false);
    }
  }, [repositories]);

  return loading ? (
    ""
  ) : (
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
  );
}

function mapStateToProps(state) {
  const { repositories } = state;
  return { repositories };
}

export default connect(mapStateToProps)(App);
