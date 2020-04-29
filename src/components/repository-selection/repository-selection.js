import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { initializeFolderSelection, setFolder } from "../../actions";

import "./repository-selection.css";

function RepositorySelection({ currentFolder, repositories, dispatch }) {
  const history = useHistory();

  const openNewDirectory = () => {
    dispatch(initializeFolderSelection());
  };

  const selectRepository = (path) => {
    dispatch(setFolder({ path, isRepo: true }));
    history.push("/repository-management");
  };

  useEffect(() => {
    if (currentFolder.path && currentFolder.isRepo) {
      history.push("/repository-management");
    }
  }, [currentFolder.path]);

  return (
    <div className="repository-selection">
      <div>
        <div className="subtitle">Select a repository you want to import: </div>
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
            onClick={openNewDirectory}
          />
        </div>
      </div>
      {repositories && repositories.length ? (
        <div>
          <div className="subtitle">Imported repositories: </div>
          <div className="imported-repositories">
            {repositories.map((repository) => (
              <div
                className="imported-repository"
                key={repository}
                onClick={() => selectRepository(repository)}
              >
                {repository}
              </div>
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
