const { test, expect, describe, beforeEach } = require('@playwright/test');

describe('Blog list', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: {
        username: 'admin',
        name: 'Sam',
        password: 'password',
      },
    });
    await page.goto('http://localhost:5173');
  });

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('blogs');
    await expect(locator).toBeVisible();
    await expect(page.getByText('username')).toBeVisible();
  });

  test('login form can be opened', async ({ page }) => {
    await page.getByTestId('username').fill('admin');
    await page.getByTestId('password').fill('password');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Sam logged-in')).toBeVisible();
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('admin');
      await page.getByTestId('password').fill('password');
      await page.getByRole('button', { name: 'login' }).click();
    });

    test('a blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click();
      await page.getByTestId('title').fill('test title');
      await page.getByTestId('url').fill('test url');
      await page.getByTestId('likes').fill('3');
      await page.getByTestId('submit').click();
      await expect(page.getByText('test title').nth(1)).toBeVisible();
    });

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click();
        await page.getByTestId('title').fill('another new title');
        await page.getByTestId('url').fill('new url');
        await page.getByTestId('likes').fill('7');
        await page.getByTestId('submit').click();
      });

      test('it can be liked', async ({ page }) => {
        const blogContainer = page
          .locator('div.title')
          .filter({ hasText: 'another new title' })
          .locator('..');
        await blogContainer.highlight();
        await blogContainer.getByRole('button', { name: 'view' }).click();
        await blogContainer.getByRole('button', { name: 'like' }).click();
        await expect(blogContainer.getByText('8')).toBeVisible();
      });
    });
  });
});
