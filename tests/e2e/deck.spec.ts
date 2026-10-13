import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the keyboard walks through all eight slides', async ({ page }) => {
  await page.goto('/');
  const counter = page.getByTestId('deck-counter');
  await expect(counter).toHaveText('1 / 8');
  await page.keyboard.press('Space');
  await expect(counter).toHaveText('2 / 8');
  await expect(page.locator('#slide-thesis')).toBeInViewport({ ratio: 0.6 });
  for (let i = 0; i < 6; i += 1) {
    await page.keyboard.press('ArrowRight');
  }
  await expect(counter).toHaveText('8 / 8');
  await expect(page.locator('#slide-end')).toBeInViewport({ ratio: 0.6 });
  await page.keyboard.press('ArrowLeft');
  await expect(counter).toHaveText('7 / 8');
});

test('the page has no axe violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
