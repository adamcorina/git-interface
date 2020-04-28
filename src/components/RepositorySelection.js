import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { initializeFolderSelection } from "../actions";

import "./RepositorySelection.css";

function RepositorySelection({ repo, dispatch }) {
  const history = useHistory();

  const openDirectory = () => {
    dispatch(initializeFolderSelection());
  };

  useEffect(() => {
    if (repo.path && repo.isRepo) {
      history.push("repository-management");
    }
  }, [repo.path]);

  return (
    <div className="repository-selection">
      <div>Select a repository you want to start with: </div>
      <div>
        <input
          type="text"
          value={repo.path}
          readOnly
          className={!repo.isRepo ? "invalid" : ""}
        />
        <img
          className="browse-icon"
          src={require("./browse.png")}
          onClick={openDirectory}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { repo } = state;
  return { repo };
}

export default connect(mapStateToProps)(RepositorySelection);
