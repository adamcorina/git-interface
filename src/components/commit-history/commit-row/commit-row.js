import React, { Component } from "react";
import moment from "moment";

class CommitRow extends Component {
  render() {
    return (
      <tr key={this.props.commit[0]}>
        <td className="branches">
          {this.props.branches.map((branch, index) => {
            let isCommonCommit = false;
            if (branch === this.props.commit[1].logs[0]["branch"]) {
              this.props.changeBranchActivity(index, true);
            }
            if (this.props.branchActivity[index] === true && this.props.commit[1].logs.length > 1) {
              this.props.commit[1].logs.slice(1).forEach((commit) => {
                if (commit.branch === branch) {
                  isCommonCommit = true;
                  this.props.changeBranchActivity(index, false);
                }
              });
            }
            return (
              <div className="branch">
                {branch === this.props.commit[1].logs[0]["branch"]
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
          <div>{this.props.commit[0].substr(0, 7)}</div>
        </td>
        <td>
          <div>{this.props.commit[1].logs[0]["branch"] + " - " + this.props.commit[1].logs[0]["message"]}</div>
        </td>
        <td>
          <div>{this.props.commit[1].logs[0]["author_name"]}</div>
        </td>
        <td>
          <div>{moment(this.props.commit[1].logs[0]["date"]).format("MM/DD/YYYY, h:mm:ss")}</div>
        </td>
      </tr>
    );
  }
}

export default CommitRow;
