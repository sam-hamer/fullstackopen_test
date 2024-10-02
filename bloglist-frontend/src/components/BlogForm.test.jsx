import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const title = screen.getByPlaceholderText('write title here');
  const url = screen.getByPlaceholderText('write url here');
  const likes = screen.getByPlaceholderText('write likes here');
  const sendButton = screen.getByText('create');

  await user.type(title, 'testing a form...');
  await user.type(url, 'www.test.com');
  await user.type(likes, '55');
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...');
  expect(createBlog.mock.calls[0][0].url).toBe('www.test.com');
  expect(createBlog.mock.calls[0][0].likes).toBe('55');
});
