const repositories = (state = null, action) => {
  switch (action.type) {
    case "SET_REPOSITORIES":
      return [...action.repositories];
    case "ADD_REPOSITORY":
      if (state.indexOf(action.path) > -1) {
        return state;
      }
      return [...state, action.path];
    default:
      return state;
  }
};

export default repositories;
