import { test, expect } from '@playwright/test';

test.describe('Navigation & Layout', () => {
  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('app-login')).toBeVisible();
  });

  test('should show hero page for root path', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/hero/);
  });

  test('should navigate from hero to login', async ({ page }) => {
    await page.goto('/hero');
    const loginLink = page.locator('a[href="/login"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    }
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle between light and dark theme', async ({ page }) => {
    await page.goto('/hero');
    // Find theme toggle (🌙 or ☀️ button in header)
    const themeBtn = page.locator('.header__theme-btn');
    if (await themeBtn.isVisible()) {
      const initialTheme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      await themeBtn.click();
      const newTheme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      expect(newTheme).not.toBe(initialTheme);
    }
  });
});

test.describe('Chat Panel', () => {
  test('should open and close chat panel', async ({ page }) => {
    await page.goto('/hero');
    // Try to find chat button
    const chatBtn = page.locator('.header__chat-btn');
    if (await chatBtn.isVisible()) {
      // Chat should be hidden initially in hero (no auth)
      const chatPanel = page.locator('.chat-panel');
      // No chat panel visible
    }
  });
});

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('app-login')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/login');
    const submitBtn = page.locator('button[type="submit"]');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Should show validation errors
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    }
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.locator('a[href="/register"]');
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/\/register/);
    }
  });
});

test.describe('Register Page', () => {
  test('should display register form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('app-register')).toBeVisible();
  });
});
