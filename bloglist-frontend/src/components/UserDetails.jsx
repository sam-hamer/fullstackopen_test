const UserDetails = ({ user }) => {
  if (!user) {
    return null;
  }
  return (
    <>
      <h3>{user.name}</h3>
      <h4>added blogs</h4>
      <ul data-testid="user-blog-list">
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  );
};

export default UserDetails;
