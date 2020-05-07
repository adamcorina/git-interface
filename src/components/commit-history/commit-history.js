import React, { Component } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";

import CommitRow from "./commit-row/commit-row";

import { getBranchInfo } from "../../actions";

import "./commit-history.css";

class CommitHistory extends Component {
  constructor(props) {
    super(props);
    this.branchActivity = Array(props.branches.length).fill(false);
    this.registerToScrollEvent();
  }

  registerToScrollEvent() {
    window.onscroll = debounce(() => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        const commitEntries = Object.entries(this.props.commits);
        const hashLastEntry = commitEntries[commitEntries.length - 1][1][0].hash.split(" ")[0];
        this.props.dispatch(
          getBranchInfo(this.props.currentFolder.path, this.props.currentFolder.current, hashLastEntry, this.props.currentFolder.activeBranches)
        );
      }
    }, 100);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentBranch !== prevProps.currentBranch) {
      this.branchActivity.fill(false);
    }
  }

  renderRows() {
    const commitEntries = Object.entries(this.props.commits);
    return commitEntries.map((commit) => {
      return (
        <CommitRow
          commit={commit}
          branches={this.props.branches}
          branchActivity={this.branchActivity}
          changeBranchActivity={(index, value) => (this.branchActivity[index] = value)}
        />
      );
    });
  }

  render() {
    return !this.props.commits ? null : (
      <table className="commit-history">
        <thead>
          <tr>
            <th className="branches">
              {this.props.branches.map((branch) => (
                <div className={`branch ${branch}`}></div>
              ))}
            </th>
            <th>Commit</th>
            <th>Description</th>
            <th>Author</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }
}

function mapStateToProps(state) {
  const { currentFolder } = state;
  return { currentFolder };
}

export default connect(mapStateToProps)(CommitHistory);
