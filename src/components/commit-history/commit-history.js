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
    const colors = [
      "#d6cbd3",
      "#92a8d1",
      "orange",
      "purple",
      "#80ced6",
      "#eca1a6",
      "lime",
      "teal",
      "white",
      "yellow",
    ];
    return commitEntries.map((commit, commitIndex) => {
      return (
        <div>
          {this.props.currentFolder.activeBranches.map((branch, branchIndex) => {
            const olderCommit = commitIndex === 0 ? null : commitEntries[commitIndex - 1];
            let lastMergedBranchIndex = null;
            let firstMergedBranchIndex = null;
            if (commit[1].logs.length > 1) {
              for (let i = commit[1].logs.length - 1; i >= 0 && lastMergedBranchIndex == null; i--) {
                const branchPosition = this.props.currentFolder.activeBranches.indexOf(commit[1].logs[i].branch);
                if (
                  branchPosition > -1 &&
                  commit[1].logs[i].branch !== branch &&
                  olderCommit &&
                  olderCommit[1].branchActivity[branchPosition]
                ) {
                  lastMergedBranchIndex = branchPosition;
                }
              }
              firstMergedBranchIndex = this.props.currentFolder.activeBranches.indexOf(commit[1].logs[0].branch);
            }

            return (
              <div className="branch" key={branch}>
                {branch === commit[1].logs[0]["branch"] ? (
                  <svg height="30" width="20">
                    {lastMergedBranchIndex !== null ? (
                      <line
                        x1="10"
                        y1="15"
                        x2="20"
                        y2="15"
                        strokeWidth="2"
                        stroke={colors[lastMergedBranchIndex]}
                      ></line>
                    ) : null}
                    <circle cx="10" cy="15" r="5" fill={colors[branchIndex]} />
                    {olderCommit && olderCommit[1].branchActivity[branchIndex] ? (
                      <line x1="10" y1="0" x2="10" y2="30" strokeWidth="2" stroke={colors[branchIndex]}></line>
                    ) : (
                      <line x1="10" y1="15" x2="10" y2="30" strokeWidth="2" stroke={colors[branchIndex]}></line>
                    )}
                  </svg>
                ) : commit[1].branchActivity[branchIndex] ? (
                  <svg height="30" width="20">
                    <line x1="10" y1="0" x2="10" y2="30" stroke-width="2" stroke={colors[branchIndex]}></line>
                    {lastMergedBranchIndex !== null &&
                    lastMergedBranchIndex > branchIndex &&
                    branchIndex > firstMergedBranchIndex ? (
                      <line
                        x1="0"
                        y1="15"
                        x2="20"
                        y2="15"
                        strokeWidth="2"
                        stroke={colors[lastMergedBranchIndex]}
                      ></line>
                    ) : null}
                  </svg>
                ) : olderCommit && olderCommit[1].branchActivity[branchIndex] ? (
                  <svg height="30" width="20">
                    <path d="M -12 15.5 q 27 2 21 -20" stroke={colors[branchIndex]} stroke-width="2" fill="none" />
                    {lastMergedBranchIndex !== null &&
                    lastMergedBranchIndex > branchIndex &&
                    branchIndex > firstMergedBranchIndex ? (
                      <line
                        x1="0"
                        y1="15"
                        x2="20"
                        y2="15"
                        strokeWidth="2"
                        stroke={colors[lastMergedBranchIndex]}
                      ></line>
                    ) : null}
                  </svg>
                ) : (
                  <svg height="30" width="20">
                    {lastMergedBranchIndex !== null &&
                    lastMergedBranchIndex > branchIndex &&
                    branchIndex > firstMergedBranchIndex ? (
                      <line
                        x1="0"
                        y1="15"
                        x2="20"
                        y2="15"
                        strokeWidth="2"
                        stroke={colors[lastMergedBranchIndex]}
                      ></line>
                    ) : null}
                  </svg>
                )}
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
