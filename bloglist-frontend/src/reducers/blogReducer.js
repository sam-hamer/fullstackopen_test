const initialState = [];

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.payload.sort((a, b) => b.likes - a.likes);
    case 'NEW_BLOG':
      return [...state, action.payload].sort((a, b) => b.likes - a.likes);
    case 'UPDATE_BLOG':
      return state
        .map((blog) => (blog.id !== action.payload.id ? blog : action.payload))
        .sort((a, b) => b.likes - a.likes);
    case 'REMOVE_BLOG':
      return state.filter((blog) => blog.id !== action.payload);
    default:
      return state;
  }
};

export const initializeBlogs = (blogs) => {
  return {
    type: 'INIT_BLOGS',
    payload: blogs,
  };
};

export const createBlog = (blog) => {
  return {
    type: 'NEW_BLOG',
    payload: blog,
  };
};

export const updateBlog = (blog) => {
  return {
    type: 'UPDATE_BLOG',
    payload: blog,
  };
};

export const removeBlog = (id) => {
  return {
    type: 'REMOVE_BLOG',
    payload: id,
  };
};

export default blogReducer;
