const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, url, likes) => {
  await page.getByRole('button', { name: 'new blog' }).click();
  await page.getByTestId('title').fill(title);
  await page.getByTestId('url').fill(url);
  await page.getByTestId('likes').fill(likes);
  await page.getByTestId('submit').click();
  await page.getByText(title).nth(1).waitFor();
};

export { loginWith, createBlog };
