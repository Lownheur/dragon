import { test, expect } from '@playwright/test';

test.describe('Hero Page', () => {
  test('should load the hero page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/hero/);
    await expect(page.locator('app-hero')).toBeVisible();
  });
});
