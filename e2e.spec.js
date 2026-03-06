const { test, expect } = require('@playwright/test');
const { createServer } = require('./server');

test.describe('Tasks demo minimal E2E', () => {
  let server;
  let baseUrl;

  test.beforeEach(async () => {
    server = createServer();
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  test.afterEach(async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });

  test('create task via Enter and toggle theme', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.getByRole('heading', { name: '任务清单' })).toBeVisible();

    const input = page.locator('#task-input');
    await input.fill('Playwright E2E Task');
    await input.press('Enter');

    await expect(page.locator('.task-item')).toContainText('Playwright E2E Task');
    await expect(page.locator('#status')).toContainText('任务已新增');

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#status')).toContainText('当前主题：dark');

    const storedTheme = await page.evaluate(() => localStorage.getItem('tasks_demo_theme'));
    expect(storedTheme).toBe('dark');
  });

  test('delete task success and show empty state', async ({ page }) => {
    await page.goto(baseUrl);

    const input = page.locator('#task-input');
    await input.fill('Task To Delete');
    await input.press('Enter');

    const taskItem = page.locator('.task-item');
    await expect(taskItem).toContainText('Task To Delete');

    await page.getByRole('button', { name: '删除' }).click();

    await expect(page.locator('.task-item')).toHaveCount(0);
    await expect(page.locator('.empty-state')).toContainText('当前没有任务');
    await expect(page.locator('#status')).toContainText('任务已删除');
  });

  test('delete task failure should show error status', async ({ page }) => {
    await page.route('**/api/tasks/*', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'task not found' })
        });
        return;
      }
      await route.continue();
    });

    await page.goto(baseUrl);

    const input = page.locator('#task-input');
    await input.fill('Task Delete Fail');
    await input.press('Enter');
    await expect(page.locator('.task-item')).toContainText('Task Delete Fail');

    await page.getByRole('button', { name: '删除' }).click();
    await expect(page.locator('#status')).toContainText('task not found');
    await expect(page.locator('.task-item')).toContainText('Task Delete Fail');
  });
});
