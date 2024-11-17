const { test, expect, describe, beforeEach } = require('@playwright/test');
import { loginWith, createBlog } from './helper.js';
describe('Blog list', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        username: 'admin',
        name: 'Sam',
        password: 'password',
      },
    });
    await page.goto('/');
  });

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('blogs');
    await expect(locator).toBeVisible();
    await expect(page.getByText('username')).toBeVisible();
  });

  test('login form can be opened', async ({ page }) => {
    await loginWith(page, 'admin', 'password');

    await expect(page.getByText('Sam logged-in')).toBeVisible();
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('admin');
      await page.getByTestId('password').fill('password');
      await page.getByRole('button', { name: 'login' }).click();
    });

    test('a blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'test url', '3');
      await expect(page.getByText('test title').nth(1)).toBeVisible();
    });

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'another new title', 'new url', '7');
      });

      test('it can be liked', async ({ page }) => {
        const blogContainer = page
          .locator('div.title')
          .filter({ hasText: 'another new title' })
          .locator('..');
        await blogContainer.getByRole('button', { name: 'view' }).click();
        await blogContainer.getByRole('button', { name: 'like' }).click();
        await expect(blogContainer.getByText('8')).toBeVisible();
      });

      test('it can be deleted', async ({ page }) => {
        const blogContainer = page
          .locator('div.title')
          .filter({ hasText: 'another new title' })
          .locator('..');

        await page.getByRole('button', { name: 'view' }).click();

        page.once('dialog', (dialog) => {
          dialog.accept();
        });

        await page.getByRole('button', { name: 'remove' }).click();
        await expect(blogContainer).not.toBeVisible();
      });

      test('blogs cannot be deleted by others', async ({ page, request }) => {
        await request.post('/api/users', {
          data: {
            username: 'user2',
            name: 'Jim',
            password: 'password',
          },
        });
        await page.getByText('logout').click();
        await loginWith(page, 'user2', 'password');
        const blogContainer = page
          .locator('div.title')
          .filter({ hasText: 'another new title' })
          .locator('..');

        await page.getByRole('button', { name: 'view' }).click();
        await expect(blogContainer.getByRole('button', { name: 'remove' })).not.toBeVisible();
      });

      test('blogs are ordered by likes', async ({ page }) => {
        await createBlog(page, 'most likes', 'most likes url', '10');
        const blogContainer = page.getByTestId('blog-list');
        await expect(blogContainer.locator('div.likes').first()).toContainText('10');
      });
    });
  });

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'admin', 'wrong');

    const errorDiv = await page.locator('.error');
    await expect(errorDiv).toContainText('Incorrect username or password');
    await expect(errorDiv).toHaveCSS('border-style', 'solid');
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
    await expect(page.getByText('Sam logged-in')).not.toBeVisible();
  });
});
