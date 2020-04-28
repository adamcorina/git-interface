import callService from "../service";

export const setFolder = (folderInfo) => ({
  type: "SET_FOLDER",
  ...folderInfo,
});

export const initializeFolderSelection = () => {
  return function (dispatch) {
    return callService("INITIALIZE_FOLDER_SELECTION").then((folderInfo) => {
      dispatch(setFolder(folderInfo));
    });
  };
};
