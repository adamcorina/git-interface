import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./RepositoryManagement.css";
// const electron = window.require("electron");
// const ipcRenderer = electron.ipcRenderer;

function RepositoryManagement() {
  useEffect(() => {}, []);

  return (
    <div className="repository-management">
      <Link className="back" to="/">
        <img src={require("./back.png")} />
      </Link>
    </div>
  );
}

export default RepositoryManagement;
