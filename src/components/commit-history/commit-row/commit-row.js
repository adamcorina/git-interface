import React, { Component } from "react";
import moment from "moment";
import "./commit-row.css";

class CommitRow extends Component {
  render() {
    return (
      <tr key={this.props.log[0]}>
        <td className="branches">
          {this.props.branches.map((branch, index) => {
            let isCommonCommit = false;
            if (branch === this.props.log[1][0]["branch"]) {
              this.props.changeBranchActivity(index, true);
            }
            if (this.props.branchActivity[index] === true && this.props.log[1].length > 1) {
              this.props.log[1].slice(1).forEach((commit) => {
                if (commit.branch === branch) {
                  isCommonCommit = true;
                  this.props.changeBranchActivity(index, false);
                }
              });
            }
            return (
              <div className="branch">
                {branch === this.props.log[1][0]["branch"]
                  ? "*"
                  : isCommonCommit
                  ? "J"
                  : this.props.branchActivity[index]
                  ? "|"
                  : ""}
              </div>
            );
          })}
        </td>
        <td>
          <div>{this.props.log[0].substr(0, 7)}</div>
        </td>
        <td>
          <div>{this.props.log[1][0]["branch"] + " - " + this.props.log[1][0]["message"]}</div>
        </td>
        <td>
          <div>{this.props.log[1][0]["author_name"]}</div>
        </td>
        <td>
          <div>{moment(this.props.log[1][0]["date"]).format("MM/DD/YYYY, h:mm:ss")}</div>
        </td>
      </tr>
    );
  }
}

export default CommitRow;
