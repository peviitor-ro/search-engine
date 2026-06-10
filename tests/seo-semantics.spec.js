import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Mock total jobs count API
  await page.route("https://api.peviitor.ro/v1/total/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        total: {
          jobs: 123456
        }
      })
    });
  });

  // Mock total companies list/count API
  await page.route("https://api.peviitor.ro/v1/logo/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        companies: [{ company: "Company A" }, { company: "Company B" }]
      })
    });
  });
});

test.describe("SEO, Semantic HTML and Heading Hierarchies", () => {
  // Test 1: Landing Page Verification
  test("landing page should have correct meta tags, single h1, and no skipped heading levels", async ({
    page
  }) => {
    await page.goto("/");

    // Title Verification
    await expect(page).toHaveTitle(
      "peviitor | motor de căutare locuri de muncă"
    );

    // Meta Description Verification
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toBe("peviitor | motor de cautare locuri de munca");

    // Open Graph Tags Verification
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toBe("peviitor.ro - motor de cautare locuri de munca");

    const ogType = await page
      .locator('meta[property="og:type"]')
      .getAttribute("content");
    expect(ogType).toBe("website");

    // Heading Hierarchy Verification
    const headings = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      ).map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: el.innerText
      }));
    });

    expect(headings.length).toBeGreaterThan(0);
    expect(headings[0].tag).toBe("h1");

    // Check no skipped heading levels
    let maxSeenLevel = 1;
    for (const heading of headings) {
      const currentLevel = parseInt(heading.tag.substring(1));
      expect(currentLevel).toBeLessThanOrEqual(maxSeenLevel + 1);
      if (currentLevel > maxSeenLevel) {
        maxSeenLevel = currentLevel;
      }
    }
  });

  // Test 2: Search Results Page Verification
  test("results page should have a visually hidden h1, ul/li list structure, and proper hierarchy", async ({
    page
  }) => {
    // Intercept/mock search API call
    await page.route("**/v1/search/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          response: {
            numFound: 2,
            docs: [
              {
                id: "1",
                title: "React Developer",
                company: "Company A",
                location: ["București"],
                workmode: "Remote"
              },
              {
                id: "2",
                title: "React Engineer",
                company: "Company B",
                location: ["Cluj-Napoca"],
                workmode: "Hybrid"
              }
            ]
          }
        })
      });
    });

    // Navigate with a query parameter to fetch results
    await page.goto("/#/rezultate?q=react");

    // Verify visually hidden h1 exists for screen-readers and crawler context
    const h1 = page.locator("h1.sr-only");
    await expect(h1).toHaveText(
      "Rezultate căutare locuri de muncă - peviitor.ro"
    );

    // Wait for the results or no-results component to render
    const resultsContainer = page.locator("ul.grid");
    await expect(resultsContainer).toBeVisible({ timeout: 10000 });

    // Wait for results count header to be visible (h2)
    const resultsCountHeader = page.locator("h2:has-text('rezultate')");
    await expect(resultsCountHeader).toBeVisible();

    // Verify results list items are wrapped in li
    const listItems = resultsContainer.locator("li");
    const count = await listItems.count();
    expect(count).toBe(2);

    // Verify heading hierarchy
    const headings = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      ).map((el) => el.tagName.toLowerCase());
    });
    expect(headings[0]).toBe("h1");
    // Ensure headings flow sequentially
    let maxSeenLevel = 1;
    for (const tag of headings) {
      const currentLevel = parseInt(tag.substring(1));
      expect(currentLevel).toBeLessThanOrEqual(maxSeenLevel + 1);
      if (currentLevel > maxSeenLevel) {
        maxSeenLevel = currentLevel;
      }
    }
  });

  // Test 3: Company Profile Page Verification
  test("company profile page should dynamically update SEO metadata and render jobs as ul/li list", async ({
    page
  }) => {
    const cif = "123456";
    const mockCompany = "Playwright Test Corp";

    // Intercept/mock API calls for company profile details
    await page.route(
      `https://api.peviitor.ro/v1/company/?cif=${cif}`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            company: {
              company: mockCompany,
              id: cif,
              brand: "Playwright",
              group: "Test Group",
              website: "https://playwright.dev",
              career: "https://playwright.dev/careers"
            }
          })
        });
      }
    );

    // Intercept/mock API calls for company's active job positions
    await page.route("**/v1/search/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          response: {
            numFound: 3,
            docs: [
              {
                id: "j1",
                title: "QA Automation Engineer",
                company: mockCompany,
                location: ["București"],
                workmode: "Remote"
              },
              {
                id: "j2",
                title: "Frontend Developer",
                company: mockCompany,
                location: ["Cluj-Napoca"],
                workmode: "Hybrid"
              },
              {
                id: "j3",
                title: "Fullstack Engineer",
                company: mockCompany,
                location: ["Iași"],
                workmode: "On-site"
              }
            ]
          }
        })
      });
    });

    // Navigate to the company page
    await page.goto(`/#/company/${cif}`);

    // Verify loaded h1 heading is present
    const profileH1 = page.locator("h1");
    await expect(profileH1).toContainText(mockCompany);

    // Verify E2E dynamic SEO updates
    const expectedTitle = `Profil Companie: ${mockCompany} - 3 joburi active | peviitor.ro`;
    const expectedDesc = `Vezi cele 3 locuri de muncă disponibile la compania ${mockCompany} în România pe peviitor.ro, motorul tău de căutare pentru joburi.`;

    await expect(page).toHaveTitle(expectedTitle);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toBe(expectedDesc);

    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toBe(expectedTitle);

    const ogDesc = await page
      .locator('meta[property="og:description"]')
      .getAttribute("content");
    expect(ogDesc).toBe(expectedDesc);

    // Verify Jobs Listing uses ul/li
    const jobsList = page.locator("ul.grid");
    await expect(jobsList).toBeVisible();

    const jobItems = jobsList.locator("li");
    expect(await jobItems.count()).toBe(3);

    // Navigate back to Homepage (Landing) and verify SEO reset
    await page.locator("nav img").click(); // Click logo to navigate home
    await expect(page).toHaveTitle(
      "peviitor | motor de căutare locuri de muncă"
    );

    const resetDesc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(resetDesc).toBe("peviitor | motor de cautare locuri de munca");
  });

  // Test 4: 404 Page verification (Single h1 present)
  test("404 page should have a semantic h1 page title", async ({ page }) => {
    await page.goto("/#/some-non-existing-route-path");

    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Pagină negăsită");

    const headings = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      ).map((el) => el.tagName.toLowerCase());
    });
    expect(headings[0]).toBe("h1");
    expect(headings.filter((tag) => tag === "h1").length).toBe(1); // Single h1
  });
});
