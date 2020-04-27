import React, { useState } from "react";
import "./App.css";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

function App() {
  const [searchPath] = useState("");

  const openDirectory = () => {
    ipcRenderer.send("selectDirectory");
  };

  return (
    <div className="App">
      <input type="text" value={searchPath} readOnly />
      <button onClick={openDirectory}>Browse</button>
    </div>
  );
}

export default App;
