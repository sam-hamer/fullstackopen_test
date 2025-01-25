import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    url: '',
    likes: '',
  });

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title,
      likes: newBlog.likes,
      url: newBlog.url,
    };

    createBlog(blogObject);

    setNewBlog({
      title: '',
      likes: '',
      url: '',
    });
  };

  const handleBlogChange = (event) => {
    setNewBlog((previousBlog) => ({
      ...previousBlog,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create a new blog</h2>
        </div>

        <form onSubmit={addBlog} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              data-testid="title"
              name="title"
              type="text"
              value={newBlog.title}
              onChange={handleBlogChange}
              placeholder="Write title here"
              className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              data-testid="url"
              name="url"
              value={newBlog.url}
              onChange={handleBlogChange}
              placeholder="https://example.com"
              className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Likes</label>
            <input
              data-testid="likes"
              name="likes"
              type="number"
              value={newBlog.likes}
              onChange={handleBlogChange}
              placeholder="0"
              className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="pt-4">
            <button
              data-testid="submit"
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
