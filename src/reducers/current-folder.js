const currentFolder = (
  state = { path: "", isRepo: true, branches: null, current: null, commits: null, activeBranches: null },
  action
) => {
  switch (action.type) {
    case "SET_FOLDER":
      return {
        path: action.path,
        isRepo: action.isRepo,
        branches: null,
        current: null,
        commits: null,
        activeBranches: null,
      };
    case "SET_BRANCHES":
      return { ...state, branches: action.branches, current: action.current };
    case "SET_BRANCH_INFO":
      return {
        ...state,
        current: action.branchName,
        commits: action.commits,
        activeBranches: action.activeBranches,
      };
    case "APPEND_COMMITS":
      return {
        ...state,
        commits: { ...state.commits, ...action.commits },
      };
    default:
      return state;
  }
};

export default currentFolder;
