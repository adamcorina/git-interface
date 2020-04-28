import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import RepositorySelection from "./components/RepositorySelection";
import RepositoryManagement from "./components/RepositoryManagement";
import rootReducer from "./reducers";

import "./index.css";

const store = createStore(rootReducer, applyMiddleware(thunk));

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
