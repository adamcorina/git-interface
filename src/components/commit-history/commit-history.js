import React from "react";
import moment from "moment";
import "./commit-history.css";

function CommitHistory({ logs }) {
  return !logs ? null : (
    <table className="commit-history">
      <thead>
        <tr>
          <th>Commit</th>
          <th>Description</th>
          <th>Date</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(logs).map((log) => {
          return (
            <tr key={log[0]}>
              <td>
                <div>{log[0].substr(0, 7)}</div>
              </td>
              <td>
                <div>{log[1][0]["message"]}</div>
              </td>
              <td>
                <div>{log[1][0]["author_name"]}</div>
              </td>
              <td>
                <div>{moment(log[1][0]["date"]).format('MM/DD/YYYY, h:mm:ss')}</div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CommitHistory;
