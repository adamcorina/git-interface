const currentFolder = (
  state = { path: "", isRepo: true, branches: null, current: null, logs: null },
  action
) => {
  switch (action.type) {
    case "SET_FOLDER":
      return {
        path: action.path,
        isRepo: action.isRepo,
        branches: null,
        current: null,
        logs: null,
      };
    case "SET_BRANCHES":
      return { ...state, branches: action.branches, current: action.current };
    case "SET_BRANCH_INFO":
      console.log(action.logs);
      return {
        ...state,
        current: action.branchName
      };
    default:
      return state;
  }
};

export default currentFolder;
