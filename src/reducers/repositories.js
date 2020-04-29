const repositories = (state = null, action) => {
  switch (action.type) {
    case "SET_REPOSITORIES":
      return [...action.repositories];
    case "SET_FOLDER":
      console.log(state, action);
      if (state.indexOf(action.path) > -1) {
        return state;
      }
      return [...state, action.path];
    default:
      return state;
  }
};

export default repositories;
