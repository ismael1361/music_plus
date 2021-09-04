export const initialState = {
  youtube_config: {},
  containsYoutubeConfig: false,
};

let reducerActions = {
  setYoutubeConfig: (state, action) => {
    return Object.assign(state, action.props);
  }
};

export const UserReducer = (state, action) => {
  let fn = reducerActions[action.type];
  if(fn && typeof fn === "function"){
    return fn(state, action);
  }
  return state;
};
