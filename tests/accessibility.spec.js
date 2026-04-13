const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const themes = ['light', 'dark'];
const views = ['cards', 'spine', 'table', 'act', 'coverage'];

for (const theme of themes) {
  test.describe(`Accessibility: ${theme} mode`, () => {
    test.use({ colorScheme: theme });

    test('should have no accessibility violations on initial load', async ({ page }) => {
      await page.goto('/');
      
      // Wait for data to load
      await page.waitForSelector('#loading', { state: 'hidden' });

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    for (const view of views) {
      test(`should have no accessibility violations in ${view} view`, async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('#loading', { state: 'hidden' });

        // Click the tab
        const tabSelector = `#tab-${view}`;
        await page.click(tabSelector);
        
        // Ensure section is visible
        await expect(page.locator(`#${view}-view`)).toBeVisible();

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();

        expect(results.violations).toEqual([]);
      });
    }
  });
}
