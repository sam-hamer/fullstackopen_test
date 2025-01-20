const initialState = {
  message: null,
  type: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload;
    case 'CLEAR_NOTIFICATION':
      return initialState;
    default:
      return state;
  }
};

export const setNotification = (message, type, timeout = 3000) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: { message, type },
    });
    setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION',
      });
    }, timeout);
  };
};

export default notificationReducer;
