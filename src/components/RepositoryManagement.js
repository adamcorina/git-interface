import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { setFolder } from "../actions";

import "./RepositoryManagement.css";

function RepositoryManagement({ repo, dispatch }) {
  const history = useHistory();
  useEffect(() => {
    if (!repo.path) {
      history.push("/");
    }
  }, []);

  return (
    <div className="repository-management">
      <Link
        className="back"
        to="/"
        onClick={() => {
          dispatch(setFolder({ path: "", isRepo: true }));
        }}
      >
        <img src={require("./back.png")} />
      </Link>
    </div>
  );
}

function mapStateToProps(state) {
  const { repo } = state;
  return { repo };
}

export default connect(mapStateToProps)(RepositoryManagement);
