const currentFolder = (state = { path: "", isRepo: true, branches: null, current: null, logs: null, activeBranches: null }, action) => {
  switch (action.type) {
    case "SET_FOLDER":
      return {
        path: action.path,
        isRepo: action.isRepo,
        branches: null,
        current: null,
        logs: null,
        activeBranches: null
      };
    case "SET_BRANCHES":
      return { ...state, branches: action.branches, current: action.current };
    case "SET_BRANCH_INFO":
      return {
        ...state,
        current: action.branchName,
        logs: action.logs,
        activeBranches: action.activeBranches
      };
    default:
      return state;
  }
};

export default currentFolder;
