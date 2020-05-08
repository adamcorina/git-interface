import React, { Component } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";

import CommitRow from "./commit-row/commit-row";

import { getBranchInfo } from "../../actions";

import "./commit-history.css";

class CommitHistory extends Component {
  constructor(props) {
    super(props);
    this.registerToScrollEvent();
  }

  registerToScrollEvent() {
    window.onscroll = debounce(() => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        const commitEntries = Object.entries(this.props.commits);
        const hashLastEntry = commitEntries[commitEntries.length - 1][0].split(" ")[0];
        this.props.dispatch(
          getBranchInfo(
            this.props.currentFolder.path,
            this.props.currentFolder.current,
            hashLastEntry,
            this.props.currentFolder.activeBranches
          )
        );
      }
    }, 100);
  }

  renderRows() {
    const commitEntries = Object.entries(this.props.commits);
    return commitEntries.map((commit, index) => {
      return (
        <CommitRow
          olderCommit={index === 0 ? null : commitEntries[index - 1]}
          commit={commit}
          branches={this.props.branches}
          activeBranches={this.props.currentFolder.activeBranches}
          currentBranch={this.props.currentBranch}
        />
      );
    });
  }

  renderCommitTree() {
    const commitEntries = Object.entries(this.props.commits);
    return commitEntries.map((commit, commitIndex) => {
      return (
        <div>
          {this.props.currentFolder.activeBranches.map((branch, branchIndex) => {
            const olderCommit = commitIndex === 0 ? null : commitEntries[commitIndex - 1];
            return (
              <div className="branch" key={branch}>
                {branch === commit[1].logs[0]["branch"]
                  ? "*"
                  : commit[1].branchActivity[branchIndex]
                  ? "|"
                  : olderCommit && olderCommit[1].branchActivity[branchIndex]
                  ? "J"
                  : ""}
              </div>
            );
          })}
        </div>
      );
    });
  }

  render() {
    return !this.props.commits ? null : (
      <>
        <div className="branches">{this.renderCommitTree()}</div>
        <table className="commit-history">
          <thead>
            <tr>
              <th>Description</th>
              <th>Commit</th>
              <th>Author</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </table>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { currentFolder } = state;
  return { currentFolder };
}

export default connect(mapStateToProps)(CommitHistory);
