import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import RepositorySelection from "./components/RepositorySelection";
import RepositoryManagement from "./components/RepositoryManagement";
import rootReducer from "./reducers";

import "./index.css";

const store = createStore(rootReducer);

render(
  <Provider store={store}>
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
  </Provider>,
  document.getElementById("root")
);
