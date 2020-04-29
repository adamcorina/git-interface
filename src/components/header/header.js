import React from "react";
import { Link } from "react-router-dom";

import "./header.css";

function Header({ goBackCallback, repositoryName }) {
  return (
    <div className="header">
      <Link className="back" to="/" onClick={goBackCallback}>
        <img src={require("./back.png")} />
      </Link>
      <div className="subtitle">{repositoryName}</div>
    </div>
  );
}

export default Header;
