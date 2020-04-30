import React from "react";

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
              <td>{log[0].substr(0,7)}</td>
              <td>{log[1][0]["message"]}</td>
              <td>{log[1][0]["author_name"]}</td>
              <td>{log[1][0]["date"]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CommitHistory;
