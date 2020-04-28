import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { initializeFolderSelection } from "../../actions";

import "./repository-selection.css";

function RepositorySelection({ currentFolder, dispatch }) {
  const history = useHistory();

  const openDirectory = () => {
    dispatch(initializeFolderSelection());
  };

  useEffect(() => {
    if (currentFolder.path && currentFolder.isRepo) {
      history.push("repository-management");
    }
  }, [currentFolder.path]);

  return (
    <div className="repository-selection">
      <div>Select a repository you want to start with: </div>
      <div>
        <input
          type="text"
          value={currentFolder.path}
          readOnly
          className={!currentFolder.isRepo ? "invalid" : ""}
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
  const { currentFolder } = state;
  return { currentFolder };
}

export default connect(mapStateToProps)(RepositorySelection);
