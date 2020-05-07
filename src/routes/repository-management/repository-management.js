import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Header from "../../components/header/header";
import Loader from "../../components/loader/loader";
import Menu from "../../components/menu/menu";
import CommitHistory from "../../components/commit-history/commit-history";

import { setFolder, getBranches, getBranchInfo } from "../../actions";

import "./repository-management.css";

function RepositoryManagement({ currentFolder, dispatch }) {
  const history = useHistory();
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentFolder.branches) {
      setLoading(false);
      dispatch(getBranchInfo(currentFolder.path, currentFolder.current));
    }
  }, [currentFolder.branches]);

  useEffect(() => {
    if (!currentFolder.path) {
      history.push("/");
    }
    dispatch(getBranches(currentFolder.path));
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
      <div className="container">
        <Menu
          branches={currentFolder.branches}
          currentBranch={currentFolder.current}
          branchClick={(branchName) => {
            dispatch(getBranchInfo(currentFolder.path, branchName));
          }}
        />
        <div className="content">
          <CommitHistory commits={currentFolder.commits} branches={currentFolder.branches} currentBranch={currentFolder.current}/>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { currentFolder } = state;
  return { currentFolder };
}

export default connect(mapStateToProps)(RepositoryManagement);
