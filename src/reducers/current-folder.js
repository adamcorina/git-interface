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
      const commitEntries = Object.entries(action.commits);
      commitEntries.forEach((commit, commitIndex) => {
        commit[1].branchActivity = commitIndex
          ? [...commitEntries[commitIndex - 1][1].branchActivity]
          : Array(state.branches.length).fill(false);
        state.branches.map((branch, branchIndex) => {
          if (branch === commit[1].logs[0]["branch"]) {
            commit[1].branchActivity[branchIndex] = true;
          }
          if (commit[1].branchActivity[branchIndex] === true && commit[1].logs.length > 1) {
            commit[1].logs.slice(1).forEach((branchCommit) => {
              if (branchCommit.branch === branch) {
                commit[1].branchActivity[branchIndex] = false;
              }
            });
          }
        });
      });

      return {
        ...state,
        current: action.branchName,
        commits: action.commits,
        activeBranches: action.activeBranches,
      };
    case "APPEND_COMMITS":
      const newCommitEntries = Object.entries(action.commits);
      const oldCommitEntries = Object.entries(state.commits);
      newCommitEntries.forEach((commit, commitIndex) => {
        commit[1].branchActivity = commitIndex
          ? [...newCommitEntries[commitIndex - 1][1].branchActivity]
          : oldCommitEntries[oldCommitEntries.length - 1][1].branchActivity;

        state.branches.map((branch, branchIndex) => {
          if (branch === commit[1].logs[0]["branch"]) {
            commit[1].branchActivity[branchIndex] = true;
          }
          if (commit[1].branchActivity[branchIndex] === true && commit[1].logs.length > 1) {
            commit[1].logs.slice(1).forEach((branchCommit) => {
              if (branchCommit.branch === branch) {
                commit[1].branchActivity[branchIndex] = false;
              }
            });
          }
        });
      });
      
      return {
        ...state,
        commits: { ...state.commits, ...action.commits },
      };
    default:
      return state;
  }
};

export default currentFolder;
