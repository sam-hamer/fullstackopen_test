const initialState = null;

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'CLEAR_USER':
      return null;
    default:
      return state;
  }
};

export const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: user,
  };
};

export const clearUser = () => {
  return {
    type: 'CLEAR_USER',
  };
};

export default userReducer;
