# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Registration Flow >> should show validation errors for empty fields
- Location: e2e\auth.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Registar/i })
    - locator resolved to <button disabled type="submit" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0">Registar</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    54 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - link "ExamPT" [ref=e5] [cursor=pointer]:
      - /url: /
      - img [ref=e6]
      - generic [ref=e12]: ExamPT
    - generic [ref=e13]:
      - generic [ref=e14]:
        - heading "Criar Conta" [level=3] [ref=e15]
        - paragraph [ref=e16]: Junta-te a nós e começa a arrasar nos exames
      - generic [ref=e17]:
        - generic [ref=e18]:
          - textbox "Email" [ref=e20]
          - textbox "Nickname público" [ref=e23]
          - textbox "Password" [ref=e25]
          - button "Registar" [disabled]
        - generic [ref=e30]: Ou continuar com
        - button "Google" [ref=e31]:
          - img [ref=e32]
          - text: Google
      - generic [ref=e38]:
        - text: Já tens conta?
        - link "Entra aqui" [ref=e39] [cursor=pointer]:
          - /url: /login
  - alert [ref=e40]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Registration Flow', () => {
  4  |   test('should show validation errors for empty fields', async ({ page }) => {
  5  |     await page.goto('/register');
  6  | 
  7  |     // Click register without filling anything
> 8  |     await page.getByRole('button', { name: /Registar/i }).click();
     |                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  9  | 
  10 |     // Check for validation messages
  11 |     // In many forms, the first thing is a required field alert or text
  12 |     await expect(page.getByText(/email/i)).toBeVisible();
  13 |   });
  14 | 
  15 |   test('should navigate to login from register page', async ({ page }) => {
  16 |     await page.goto('/register');
  17 |     
  18 |     // Verify register heading
  19 |     await expect(page.getByRole('heading', { name: /Criar Conta/i })).toBeVisible();
  20 |     
  21 |     const loginLink = page.getByRole('link', { name: /Entra aqui/i });
  22 |     await loginLink.click();
  23 |     
  24 |     await expect(page).toHaveURL(/\/login/);
  25 |   });
  26 | });
  27 | 
```