import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page and show the brand name', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('/');

    // Check if the title contains "ExamPT"
    await expect(page).toHaveTitle(/ExamPT/);

    // Verify the main header text is visible
    const brandName = page.getByText('ExamPT', { exact: true }).first();
    await expect(brandName).toBeVisible();

    // Verify the "Começar Agora" button is present
    const ctaButton = page.getByRole('link', { name: /Começar Grátis/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('should navigate to the login page', async ({ page }) => {
    await page.goto('/');

    // Find the login link/button
    const loginLink = page.getByRole('link', { name: /Login/i });
    await expect(loginLink).toBeVisible();

    // Click it and verify URL
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
    
    // Verify login heading
    await expect(page.getByRole('heading', { name: /Bem-vindo de volta/i })).toBeVisible();
  });
});
