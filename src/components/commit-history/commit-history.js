import React, { Component } from "react";
import moment from "moment";
import "./commit-history.css";

class CommitHistory extends Component {
  constructor(props) {
    super(props);
    this.branchActivity = [];
    if (props.activeBranches) {
      props.activeBranches.forEach((_branch) => this.branchActivity.push(false));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentBranch !== prevProps.currentBranch) {
      this.branchActivity.forEach((_branch, index) => (this.branchActivity[index] = false));
    }
  }

  renderRows() {
    const logEntries = Object.entries(this.props.logs);
    return logEntries.map((log, logIndex) => {
      return (
        <tr key={log[0]}>
          <td className="branches">
            {this.props.activeBranches.map((branch, index) => {
              let nextIsCommonCommit = false;
              if (branch === log[1][0]["branch"]) {
                this.branchActivity[index] = true;
              }
              if (this.branchActivity[index] === true && logEntries[logIndex + 1] && branch !== this.props.currentBranch) {
                logEntries[logIndex + 1][1].forEach((commit) => {
                  if (logEntries[logIndex + 1][1].length > 1 && commit.branch === branch) {
                    nextIsCommonCommit = true;
                    this.branchActivity[index] = false;
                  }
                });
              }
              return (
                <div className="branch">
                  {nextIsCommonCommit
                    ? branch === log[1][0]["branch"]
                      ? "*J"
                      : "J"
                    : branch === log[1][0]["branch"]
                    ? "*"
                    : this.branchActivity[index]
                    ? "|"
                    : ""}
                </div>
              );
            })}
          </td>
          <td>
            <div>{log[0].substr(0, 7)}</div>
          </td>
          <td>
            <div>{log[1][0]["branch"] + " - " + log[1][0]["message"]}</div>
          </td>
          <td>
            <div>{log[1][0]["author_name"]}</div>
          </td>
          <td>
            <div>{moment(log[1][0]["date"]).format("MM/DD/YYYY, h:mm:ss")}</div>
          </td>
        </tr>
      );
    });
  }

  render() {
    return !this.props.logs ? null : (
      <table className="commit-history">
        <thead>
          <tr>
            <th className="branches">
              {this.props.activeBranches.map((branch) => (
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
