const currentFolder = (
  state = { path: "", isRepo: true, branchInfo: null },
  action
) => {
  switch (action.type) {
    case "SET_FOLDER":
      return { path: action.path, isRepo: action.isRepo, branchInfo: null };
    case "SET_BRANCH_INFO":
      return { ...state, branchInfo: action.branchInfo };
    default:
      return state;
  }
};

export default currentFolder;
