import React, { Component } from "react";
import debounce from "lodash.debounce";

import CommitRow from "./commit-row/commit-row";

import "./commit-history.css";

class CommitHistory extends Component {
  constructor(props) {
    super(props);
    this.branchActivity = Array(props.branches.length).fill(false);
    this.registerToScrollEvent()
  }

  registerToScrollEvent() {
    window.onscroll = debounce(() => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        const logEntries = Object.entries(this.props.logs);
        console.log(logEntries[logEntries.length - 1][1][0].hash.split(" ")[0])
      }
    }, 100);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentBranch !== prevProps.currentBranch) {
      this.branchActivity.fill(false);
    }
  }

  renderRows() {
    const logEntries = Object.entries(this.props.logs);
    return logEntries.map((log) => {
      return (
        <CommitRow
          log={log}
          branches={this.props.branches}
          branchActivity={this.branchActivity}
          changeBranchActivity={(index, value) => (this.branchActivity[index] = value)}
        />
      );
    });
  }

  render() {
    return !this.props.logs ? null : (
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

export default CommitHistory;
