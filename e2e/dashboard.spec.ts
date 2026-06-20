import { test, expect } from '@playwright/test';

test.describe('Navigation & Layout', () => {
  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('/app/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.locator('app-login')).toBeVisible();
  });

  test('should show hero page for root path', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/hero/);
  });

  test('should navigate from hero to login', async ({ page }) => {
    await page.goto('/hero');
    const loginLink = page.locator('a[href="/auth/login"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/auth\/login/);
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

test.describe('Language Toggle', () => {
  test('should switch language between FR and EN', async ({ page }) => {
    await page.goto('/hero');
    const langBtn = page.locator('.header__lang-btn');
    if (await langBtn.isVisible()) {
      const initialLocale = await langBtn.textContent();
      await langBtn.click();
      const newLocale = await langBtn.textContent();
      expect(newLocale).not.toBe(initialLocale);
    }
  });
});

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('app-login')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/auth/login');
    const submitBtn = page.locator('button[type="submit"]');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Should show validation errors
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    }
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login');
    const registerLink = page.locator('a[href="/auth/register"]');
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/\/auth\/register/);
    }
  });
});

test.describe('Register Page', () => {
  test('should display register form', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.locator('app-register')).toBeVisible();
  });
});

