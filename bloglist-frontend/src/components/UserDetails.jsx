const UserDetails = ({ user }) => {
  if (!user) {
    return null;
  }
  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900">Added Blogs</h3>
            <div className="mt-4">
              <ul data-testid="user-blog-list" className="space-y-3">
                {user.blogs.map((blog) => (
                  <li
                    key={blog.id}
                    className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700"
                  >
                    {blog.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
