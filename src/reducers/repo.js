const repo = (state = null, action) => {
  switch (action.type) {
    case "SET_REPO":
      return { path: action.path };
    default:
      return state;
  }
};

export default repo;
