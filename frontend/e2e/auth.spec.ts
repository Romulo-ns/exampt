import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/register');

    // Click register without filling anything
    await page.getByRole('button', { name: /Registar/i }).click();

    // Check for validation messages
    // In many forms, the first thing is a required field alert or text
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('should navigate to login from register page', async ({ page }) => {
    await page.goto('/register');
    
    // Verify register heading
    await expect(page.getByRole('heading', { name: /Criar Conta/i })).toBeVisible();
    
    const loginLink = page.getByRole('link', { name: /Entra aqui/i });
    await loginLink.click();
    
    await expect(page).toHaveURL(/\/login/);
  });
});
