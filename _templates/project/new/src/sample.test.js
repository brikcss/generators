---
to: "<%= (locals.features.testing) ? locals.dest + `${locals.features.monorepo ? 'packages/sample/' : ''}src/sample.test.js` : null %>"
---
/* eslint-env jest */
<% if (locals.features.browserTesting || locals.features.uiTesting) { _%>
const playwright = require('playwright')
<%_ } %>

describe('Sample unit tests', () => {
  test('add 1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2)
  })
})

<% if (locals.features.browserTesting) { _%>
describe('Sample browser tests', () => {
  test('whatsmyuseragent in all browsers', () => {
    expect.assertions(3)
    (async () => {
      for (const browserType of ['chromium', 'firefox', 'webkit']) {
        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://www.example.com/');
        expect(await page.title()).toBe('Example Domain');
        await browser.close();
      }
    })();
  })
})
<%_ } %>

<% if (locals.features.uiTesting) { _%>
describe('Sample visual regression tests', () => {
  let browser;

  beforeAll(async () => {
    browser = await playwright.chromium.launch();
  });

  it('matches previous regression', async () => {
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });

  afterAll(async () => {
    await browser.close();
  });
})
<%_ } %>
