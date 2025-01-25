const initialState = [];

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.payload;
    case 'CLEAR_USERS':
      return null;
    default:
      return state;
  }
};

export const initializeUsers = (users) => {
  console.log(users);
  return {
    type: 'INIT_USERS',
    payload: users,
  };
};

export const clearUsers = () => {
  return {
    type: 'CLEAR_USERS',
  };
};

export default usersReducer;
