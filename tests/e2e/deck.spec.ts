import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the keyboard walks through all seven slides', async ({ page }) => {
  await page.goto('/');
  const counter = page.getByTestId('deck-counter');
  await expect(counter).toHaveText('1 / 7');
  await page.keyboard.press('Space');
  await expect(counter).toHaveText('2 / 7');
  await expect(page.locator('#slide-thesis')).toBeInViewport({ ratio: 0.6 });
  for (let i = 0; i < 5; i += 1) {
    await page.keyboard.press('ArrowRight');
  }
  await expect(counter).toHaveText('7 / 7');
  await expect(page.locator('#slide-end')).toBeInViewport({ ratio: 0.6 });
  await page.keyboard.press('ArrowLeft');
  await expect(counter).toHaveText('6 / 7');
});

test('the page has no axe violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
