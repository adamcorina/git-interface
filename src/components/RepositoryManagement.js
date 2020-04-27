import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./RepositoryManagement.css";

function RepositoryManagement({ repo }) {
  const history = useHistory();
  useEffect(() => {
    if (repo === null) {
      history.push("/");
    }
  }, [repo]);

  return (
    <div className="repository-management">
      <Link className="back" to="/">
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
