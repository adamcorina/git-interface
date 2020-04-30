import React from "react";
import Collapsible from "react-collapsible";

import "./menu.css";

function Menu({ branches = [], branchClick, currentBranch }) {
  return (
    <div className="menu">
      <Collapsible
        className="submenu"
        open
        trigger={
          <div>
            Branches
            <img src={require("./arrow-right.png")} />
          </div>
        }
        triggerTagName="div"
        transitionTime={0.2}
        triggerWhenOpen={
          <div>
            Branches
            <img src={require("./arrow-down.png")} />
          </div>
        }
      >
        {branches.map((branch) => (
          <div
            key={branch}
            className={`menu-item ${branch === currentBranch ? "current" : ""}`}
            onClick={() => {
              branchClick(branch);
            }}
          >
            {branch}
          </div>
        ))}
      </Collapsible>
    </div>
  );
}

export default Menu;
