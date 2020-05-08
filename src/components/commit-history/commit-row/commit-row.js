import React, { Component } from "react";
import moment from "moment";

class CommitRow extends Component {
  render() {
    const heads = [];
    this.props.commit[1].logs.forEach((log) => {
      const logParts = log.refs.split(", ")
      logParts.forEach(logPart => {
        if (logPart.indexOf("HEAD ->") > -1) {
          heads.push(logPart);
        }
      })
    });
    let headsToRender = heads.map((head) => {
      return <span className="tag">{head}</span>;
    });
    return (
      <tr key={this.props.commit[0]}>
        <td className="branches">
          {this.props.activeBranches.map((branch, index) => {
            return (
              <div className="branch" key={branch}>
                {branch === this.props.commit[1].logs[0]["branch"]
                  ? "*"
                  : this.props.commit[1].branchActivity[index]
                  ? "|"
                  : this.props.olderCommit && this.props.olderCommit[1].branchActivity[index]
                  ? "J"
                  : ""}
              </div>
            );
          })}
        </td>
        <td>
          <div>{heads.length ? headsToRender : ""} {this.props.commit[1].logs[0]["message"]}</div>
        </td>
        <td>
          <div>{this.props.commit[0].substr(0, 7)}</div>
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
