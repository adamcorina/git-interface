import { combineReducers } from "redux";
import currentFolder from "./current-folder";
import repositories from "./repositories";

export default combineReducers({
  currentFolder,
  repositories,
});
