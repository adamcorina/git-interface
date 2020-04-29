import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Header from "../header/header";

import { setFolder } from "../../actions";

import "./repository-management.css";

function RepositoryManagement({ currentFolder, dispatch }) {
  const history = useHistory();
  useEffect(() => {
    if (!currentFolder.path) {
      history.push("/");
    }
  }, []);

  const pathParts = currentFolder.path.split("/");
  const repositoryName = pathParts[pathParts.length - 1];

  return (
    <div className="repository-management">
      <Header
        goBackCallback={() => {
          dispatch(setFolder({ path: "", isRepo: true }));
        }}
        repositoryName={repositoryName}
      />
    </div>
  );
}

function mapStateToProps(state) {
  const { currentFolder } = state;
  return { currentFolder };
}

export default connect(mapStateToProps)(RepositoryManagement);
