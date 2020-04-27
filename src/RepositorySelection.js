import React, { useState, useEffect } from "react";
import "./RepositorySelection.css";
import { useHistory } from "react-router-dom";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

function RepositorySelection() {
  const history = useHistory();
  const [searchPath, setSearchPath] = useState("");
  const [isValidSearch, setIsValidSearch] = useState(true);

  const openDirectory = () => {
    ipcRenderer.send("selectDirectory");
  };

  const onDirectorySelection = (results) => {
    setSearchPath(results.path);
    setIsValidSearch(results.isRepo);

    if (results.isRepo) {
      history.push("repository-management");
    }
  };

  useEffect(() => {
    ipcRenderer.on("selectedDirectory", (event, results) => {
      onDirectorySelection(results);
    });
  }, []);

  return (
    <div className="repository-selection">
      <div>Select a repository you want to start with: </div>
      <div>
        <input
          type="text"
          value={searchPath}
          readOnly
          className={!isValidSearch ? "invalid" : ""}
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

export default RepositorySelection;
