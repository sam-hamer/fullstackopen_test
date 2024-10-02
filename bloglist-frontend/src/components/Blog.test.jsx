import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders title, author', () => {
  const user = {
    username: 'samwise',
    name: 'Sam',
  };
  const blog = {
    title: 'Some Blog Title',
    author: 'Harry Potter',
    url: 'https://isvoldemortreal.com/',
    likes: 7,
    user: user,
  };

  let container = render(<Blog blog={blog} user={user} />).container;

  const title = container.querySelector('.title');
  expect(getComputedStyle(title).display).toBe('block');
  const author = container.querySelector('.author');
  expect(getComputedStyle(author).display).toBe('block');
  const url = container.querySelector('.url');
  expect(getComputedStyle(url.parentElement).display).toBe('none');
  const likes = container.querySelector('.likes');
  expect(getComputedStyle(likes.parentElement).display).toBe('none');
});

test('renders url, likes after clicking button', async () => {
  const user = {
    username: 'samwise',
    name: 'Sam',
  };
  const blog = {
    title: 'Some Blog Title',
    author: 'Harry Potter',
    url: 'https://isvoldemortreal.com/',
    likes: 7,
    user: user,
  };

  let container = render(<Blog blog={blog} user={user} />).container;

  const userInput = userEvent.setup();
  const button = screen.getByText('view');
  await userInput.click(button);

  const title = container.querySelector('.title');
  expect(getComputedStyle(title).display).toBe('block');
  const author = container.querySelector('.author');
  expect(getComputedStyle(author).display).toBe('block');
  const url = container.querySelector('.url');
  expect(getComputedStyle(url.parentElement).display).toBe('block');
  const likes = container.querySelector('.likes');
  expect(getComputedStyle(likes.parentElement).display).toBe('block');
});

test('clicking the button twice calls event handler twice', async () => {
  const user = {
    username: 'samwise',
    name: 'Sam',
  };
  const blog = {
    title: 'Some Blog Title',
    author: 'Harry Potter',
    url: 'https://isvoldemortreal.com/',
    likes: 7,
    user: user,
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} user={user} handleLike={mockHandler} />);

  const userInput = userEvent.setup();
  const button = screen.getByText('like');
  await userInput.click(button);
  await userInput.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
