import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { setFolder } from "../../actions";

import "./repository-management.css";

function RepositoryManagement({ currentFolder, dispatch }) {
  const history = useHistory();
  useEffect(() => {
    if (!currentFolder.path) {
      history.push("/");
    }
  }, []);

  return (
    <div className="repository-management">
      <Link
        className="back"
        to="/"
        onClick={() => {
          dispatch(setFolder({ path: "", isRepo: true }));
        }}
      >
        <img src={require("./back.png")} />
      </Link>
    </div>
  );
}

function mapStateToProps(state) {
  const { currentFolder } = state;
  return { currentFolder };
}

export default connect(mapStateToProps)(RepositoryManagement);
