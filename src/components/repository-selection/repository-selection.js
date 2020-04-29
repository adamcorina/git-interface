import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { initializeFolderSelection } from "../../actions";

import "./repository-selection.css";

function RepositorySelection({ currentFolder, repositories, dispatch }) {
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
      <div>
        <div>Select a repository you want to import: </div>
        <div className="browse-files">
          <input
            type="text"
            value={currentFolder.path || ""}
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
      {repositories && repositories.length ? (
        <div>
          <div>Imported repositories: </div>
          <div>
            {repositories.map((repository) => (
              <div key={repository}>{repository}</div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function mapStateToProps(state) {
  const { currentFolder, repositories } = state;
  return { currentFolder, repositories };
}

export default connect(mapStateToProps)(RepositorySelection);
