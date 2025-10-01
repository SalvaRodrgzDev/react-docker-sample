import { test, expect } from '@playwright/test'

// Keep a distinct extension (pw.ts) so Jest won't match it.
// Playwright baseURL is configured in playwright.config.ts

test('home page shows heading and increments counter', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /vite \+ react/i })).toBeVisible()

  const btn = page.getByRole('button', { name: /count is/i })
  await btn.click()
  await expect(btn).toHaveText(/count is\s*1/i)
})
