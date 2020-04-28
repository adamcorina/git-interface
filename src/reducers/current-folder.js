const currentFolder = (state = { path: "", isRepo: true }, action) => {
  switch (action.type) {
    case "SET_FOLDER":
      return { path: action.path, isRepo: action.isRepo };
    default:
      return state;
  }
};

export default currentFolder;
