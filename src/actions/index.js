import callService from "../service";

export const setFolder = (folderInfo) => ({
  type: "SET_FOLDER",
  ...folderInfo,
});

export const addRepository = (folderInfo) => ({
  type: "ADD_REPOSITORY",
  ...{ path: folderInfo.path },
});

export const setRepositories = (repositoriesInfo) => ({
  type: "SET_REPOSITORIES",
  ...repositoriesInfo,
});

export const setBranches = (branches) => ({
  type: "SET_BRANCHES",
  ...branches,
});

export const setBranchInfo = (branchInfo) => ({
  type: "SET_BRANCH_INFO",
  ...branchInfo,
});

export const appendLogs = (branchInfo) => ({
  type: "APPEND_LOGS",
  ...branchInfo,
});

export const initializeFolderSelection = () => {
  return function (dispatch) {
    return callService("INITIALIZE_DIRECTORY_SELECTION").then((folderInfo) => {
      dispatch(setFolder(folderInfo));
      if (folderInfo.isRepo) {
        dispatch(addRepository(folderInfo));
      }
    });
  };
};

export const getImportedRepositories = () => {
  return function (dispatch) {
    return callService("GET_REPOSITORIES").then((repositoriesInfo) => {
      dispatch(setRepositories(repositoriesInfo));
    });
  };
};

export const getBranches = (path) => {
  return function (dispatch) {
    return callService("GET_BRANCHES", { path }).then((branches) => {
      dispatch(setBranches(branches));
    });
  };
};

export const getBranchInfo = (path, branchName, startFrom = null, activeBranches = []) => {
  return function (dispatch) {
    return callService("GET_BRANCH_INFO", { path, branchName, startFrom, activeBranches }).then((branchInfo) => {
      if (!startFrom) {
        dispatch(setBranchInfo(branchInfo));
      } else {
        dispatch(appendLogs(branchInfo));
      }
    });
  };
};
