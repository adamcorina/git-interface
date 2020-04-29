import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Header from "../../components/header/header";
import Loader from "../../components/loader/loader";
import Menu from "../../components/menu/menu";

import { setFolder, getBranchInfo } from "../../actions";

import "./repository-management.css";

function RepositoryManagement({ currentFolder, dispatch }) {
  const history = useHistory();
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentFolder.branchInfo) {
      setLoading(false);
    }
  }, [currentFolder.branchInfo]);

  useEffect(() => {
    if (!currentFolder.path) {
      history.push("/");
    }
    dispatch(getBranchInfo(currentFolder.path));
  }, []);

  const pathParts = currentFolder.path.split("/");
  const repositoryName = pathParts[pathParts.length - 1];

  return loading ? (
    <Loader />
  ) : (
    <div className="repository-management">
      <Header
        goBackCallback={() => {
          dispatch(setFolder({ path: "", isRepo: true }));
        }}
        repositoryName={repositoryName}
      />
      <div className="content">
        <Menu branches={currentFolder.branchInfo.all}/>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { currentFolder } = state;
  return { currentFolder };
}

export default connect(mapStateToProps)(RepositoryManagement);
