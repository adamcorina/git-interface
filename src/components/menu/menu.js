import React from "react";
import Collapsible from "react-collapsible";

import "./menu.css";

function Menu({ branches = [], optionClick }) {
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
            key={branch[0]}
            className={`menu-item ${branch[1] ? "current" : ""}`}
            onClick={()=>{optionClick(branch[0])}}
          >
            {branch[0]}
          </div>
        ))}
      </Collapsible>
    </div>
  );
}

export default Menu;
