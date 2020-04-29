import callService from "../service";

export const setFolder = (folderInfo) => ({
  type: "SET_FOLDER",
  ...folderInfo,
});

export const setRepositories = (repositoriesInfo) => ({
  type: "SET_REPOSITORIES",
  ...repositoriesInfo,
});

export const initializeFolderSelection = () => {
  return function (dispatch) {
    return callService("INITIALIZE_DIRECTORY_SELECTION").then((folderInfo) => {
      dispatch(setFolder(folderInfo));
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
