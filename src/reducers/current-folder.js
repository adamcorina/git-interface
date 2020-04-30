const currentFolder = (
  state = { path: "", isRepo: true, branches: null, logs: null },
  action
) => {
  switch (action.type) {
    case "SET_FOLDER":
      return { path: action.path, isRepo: action.isRepo, branches: null, logs: null };
    case "SET_BRANCHES":
      return { ...state, branches: action.branches };
    case "SET_BRANCH_INFO":
      console.log(action.logs);
      let oldBranchName = "";
      Object.values(state.branches).forEach((branchInfo) => {
        if (branchInfo.current) {
          oldBranchName = branchInfo.name;
        }
      });
      return {
        ...state,
        branches:{
          ...state.branches,
          [oldBranchName]: { ...state.branches[oldBranchName], current: false },
          [action.branchName]: { ...state.branches[action.branchName], current: true }
        }
      };
    default:
      return state;
  }
};

export default currentFolder;
