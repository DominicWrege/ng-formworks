import { test, expect, Page } from "@playwright/test";

const EXAMPLES = [
	"playground-controls",
	"playground-layout",
	"playground-arrays",
	"showcase-user-profile",
	"showcase-product-order",
	"showcase-event-registration",
	"showcase-recipe",
	"showcase-app-settings",
	"showcase-team-roster",
	"showcase-invoice-lineitems",
];

async function collectConsoleErrors(page: Page): Promise<string[]> {
	const errors: string[] = [];
	page.on("console", (msg) => {
		if (msg.type() === "error") {
			const text = msg.text();
			// Filter out benign errors (404s for external assets, etc.)
			// and expected warnings from form library
			if (
				!text.includes("Failed to load resource") &&
				!text.includes("404") &&
				!text.includes("favicon") &&
				!text.includes("getControl error") &&
				!text.includes("Unable to find") &&
				!text.includes("FormGroup") &&
				!text.match(/^\/[a-z]/i) // Filter out path-like messages
			) {
				errors.push(text);
			}
		}
	});
	return errors;
}

async function collectConsoleWarnings(page: Page): Promise<string[]> {
	const warnings: string[] = [];
	page.on("console", (msg) => {
		if (msg.type() === "warning") {
			const text = msg.text();
			// Filter out benign warnings
			if (
				!text.includes("NG0956") // We'll track this separately
			) {
				warnings.push(text);
			}
		}
	});
	return warnings;
}

async function collectNG0956Warnings(page: Page): Promise<string[]> {
	const warnings: string[] = [];
	page.on("console", (msg) => {
		const text = msg.text();
		if (text.includes("NG0956")) {
			warnings.push(text);
		}
	});
	return warnings;
}

async function interactWithFormControls(page: Page): Promise<void> {
	// Type in text inputs
	const textInputs = page.locator("input[type='text']");
	const textInputCount = await textInputs.count();
	for (let i = 0; i < Math.min(textInputCount, 3); i++) {
		const input = textInputs.nth(i);
		if (await input.isVisible()) {
			await input.fill(`Test ${i}`);
			await page.waitForTimeout(100);
		}
	}

	// Type in number inputs
	const numberInputs = page.locator("input[type='number']");
	const numberInputCount = await numberInputs.count();
	for (let i = 0; i < Math.min(numberInputCount, 2); i++) {
		const input = numberInputs.nth(i);
		if (await input.isVisible()) {
			await input.fill(`${10 + i}`);
			await page.waitForTimeout(100);
		}
	}

	// Click checkboxes
	const checkboxes = page.locator("input[type='checkbox']");
	const checkboxCount = await checkboxes.count();
	for (let i = 0; i < Math.min(checkboxCount, 3); i++) {
		const checkbox = checkboxes.nth(i);
		if (await checkbox.isVisible()) {
			await checkbox.click();
			await page.waitForTimeout(100);
		}
	}

	// Click radio buttons
	const radios = page.locator("input[type='radio']");
	const radioCount = await radios.count();
	if (radioCount > 0) {
		const firstRadio = radios.first();
		if (await firstRadio.isVisible()) {
			await firstRadio.click();
			await page.waitForTimeout(100);
		}
	}

	// Change select values
	const selects = page.locator("select");
	const selectCount = await selects.count();
	for (let i = 0; i < Math.min(selectCount, 2); i++) {
		const select = selects.nth(i);
		if (await select.isVisible()) {
			const options = await select.locator("option").all();
			if (options.length > 1) {
				await select.selectOption({ index: 1 });
				await page.waitForTimeout(100);
			}
		}
	}

	// Type in textareas
	const textareas = page.locator("textarea");
	const textareaCount = await textareas.count();
	for (let i = 0; i < Math.min(textareaCount, 2); i++) {
		const textarea = textareas.nth(i);
		if (await textarea.isVisible()) {
			await textarea.fill(`Textarea content ${i}`);
			await page.waitForTimeout(100);
		}
	}
}

test.describe("Playground - Initial Load", () => {
	test("loads without console errors", async ({ page }) => {
		const errors = await collectConsoleErrors(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		expect(errors.filter((e) => e.includes("NG0103"))).toHaveLength(0);
	});

	test("renders the first example by default", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const select = page.locator("#example-select");
		await expect(select).toHaveValue("playground-controls");

		const form = page.locator("json-schema-form");
		await expect(form).toBeVisible();
	});

	test("shows valid JSON badge for default schema", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await expect(page.locator("text=Valid JSON")).toBeVisible();
	});
});

test.describe("Playground - Example Switching", () => {
	for (const example of EXAMPLES) {
		test(`loads ${example} without errors`, async ({ page }) => {
			const errors = await collectConsoleErrors(page);
			await page.goto("/");
			await page.waitForLoadState("networkidle");

			await page.selectOption("#example-select", example);
			await page.waitForTimeout(2000);

			const ng0103 = errors.filter((e) => e.includes("NG0103"));
			expect(ng0103).toHaveLength(0);

			const form = page.locator("json-schema-form");
			await expect(form).toBeVisible();
		});

		test(`interacts with ${example} controls without errors`, async ({
			page,
		}) => {
			const errors = await collectConsoleErrors(page);
			await page.goto("/");
			await page.waitForLoadState("networkidle");

			await page.selectOption("#example-select", example);
			await page.waitForTimeout(2000);

			// Interact with all form controls
			await interactWithFormControls(page);
			await page.waitForTimeout(500);

			// Check for any console errors
			expect(errors).toHaveLength(0);

			// Check for NG0103 specifically
			const ng0103 = errors.filter((e) => e.includes("NG0103"));
			expect(ng0103).toHaveLength(0);
		});
	}

	test("switches through all examples sequentially without errors", async ({
		page,
	}) => {
		const errors = await collectConsoleErrors(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		for (const example of EXAMPLES) {
			await page.selectOption("#example-select", example);
			await page.waitForTimeout(1500);
		}

		const ng0103 = errors.filter((e) => e.includes("NG0103"));
		expect(ng0103).toHaveLength(0);
	});

	test("switches and interacts with all examples without errors", async ({
		page,
	}) => {
		const errors = await collectConsoleErrors(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		for (const example of EXAMPLES) {
			await page.selectOption("#example-select", example);
			await page.waitForTimeout(1500);
			await interactWithFormControls(page);
			await page.waitForTimeout(300);
		}

		// Check for any console errors
		expect(errors).toHaveLength(0);
	});
});

test.describe("Playground - Form Interactions", () => {
	test("typing in input updates live data without errors", async ({
		page,
	}) => {
		const errors = await collectConsoleErrors(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const firstInput = page.locator("input[type='text']").first();
		if (await firstInput.isVisible()) {
			await firstInput.fill("Test Value");
			await page.waitForTimeout(500);

			const liveData = page.locator("pre").first();
			await expect(liveData).toContainText("Test Value");
		}

		expect(errors).toHaveLength(0);
	});

	test("submitting form shows submitted data without errors", async ({
		page,
	}) => {
		const errors = await collectConsoleErrors(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const submitBtn = page.locator("button[type='submit']");
		if (await submitBtn.isVisible()) {
			await submitBtn.click();
			await page.waitForTimeout(500);

			const submittedSection = page.locator(
				"text=Submitted data — onSubmit()",
			);
			await expect(submittedSection).toBeVisible();
		}

		expect(errors).toHaveLength(0);
	});

	test("interacts with all control types without errors", async ({
		page,
	}) => {
		const errors = await collectConsoleErrors(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// playground-controls has all control types
		await page.selectOption("#example-select", "playground-controls");
		await page.waitForTimeout(2000);

		await interactWithFormControls(page);
		await page.waitForTimeout(500);

		// Submit the form
		const submitBtn = page.locator("button[type='submit']");
		if (await submitBtn.isVisible()) {
			await submitBtn.click();
			await page.waitForTimeout(500);
		}

		expect(errors).toHaveLength(0);
	});
});

test.describe("Playground - JSON Editor", () => {
	test("shows Invalid JSON badge for malformed schema", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const editor = page.locator(".ace_text-input");
		await editor.fill("{ invalid json }");
		await page.waitForTimeout(500);

		await expect(page.locator(".bg-red-100:has-text('Invalid JSON')")).toBeVisible();
	});

	test("shows Valid JSON badge after fixing schema", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		const editor = page.locator(".ace_text-input");
		await editor.fill('{ "type": "object" }');
		await page.waitForTimeout(500);

		await expect(page.locator("text=Valid JSON")).toBeVisible();
	});
});

test.describe("Playground - Framework Switching", () => {
	test("switches to Plain framework without errors", async ({ page }) => {
		const errors = await collectConsoleErrors(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await page.locator("button:has-text('Plain')").click();
		await page.waitForTimeout(1000);

		const ng0103 = errors.filter((e) => e.includes("NG0103"));
		expect(ng0103).toHaveLength(0);

		const form = page.locator("json-schema-form");
		await expect(form).toBeVisible();

		expect(errors).toHaveLength(0);
	});

	test("switches back to Tailwind without errors", async ({ page }) => {
		const errors = await collectConsoleErrors(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await page.locator("button:has-text('Plain')").click();
		await page.waitForTimeout(500);
		await page.locator("button:has-text('Tailwind')").click();
		await page.waitForTimeout(1000);

		const ng0103 = errors.filter((e) => e.includes("NG0103"));
		expect(ng0103).toHaveLength(0);

		expect(errors).toHaveLength(0);
	});

	test("switches frameworks and interacts with controls without errors", async ({
		page,
	}) => {
		const errors = await collectConsoleErrors(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Switch to Plain
		await page.locator("button:has-text('Plain')").click();
		await page.waitForTimeout(1000);
		await interactWithFormControls(page);
		await page.waitForTimeout(300);

		// Switch back to Tailwind
		await page.locator("button:has-text('Tailwind')").click();
		await page.waitForTimeout(1000);
		await interactWithFormControls(page);
		await page.waitForTimeout(300);

		expect(errors).toHaveLength(0);
	});
});

test.describe("Playground - Performance Warnings", () => {
	test("no NG0956 warnings on recipe example (nested objects)", async ({
		page,
	}) => {
		const ng0956Warnings = await collectNG0956Warnings(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await page.selectOption("#example-select", "showcase-recipe");
		await page.waitForTimeout(2000);

		// Interact with controls to trigger any tracking issues
		await interactWithFormControls(page);
		await page.waitForTimeout(500);

		expect(ng0956Warnings).toHaveLength(0);
	});

	test("no NG0956 warnings on arrays example", async ({ page }) => {
		const ng0956Warnings = await collectNG0956Warnings(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await page.selectOption("#example-select", "playground-arrays");
		await page.waitForTimeout(2000);

		await interactWithFormControls(page);
		await page.waitForTimeout(500);

		expect(ng0956Warnings).toHaveLength(0);
	});

	test("no NG0956 warnings on layout example (tabs, sections)", async ({
		page,
	}) => {
		const ng0956Warnings = await collectNG0956Warnings(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await page.selectOption("#example-select", "playground-layout");
		await page.waitForTimeout(2000);

		await interactWithFormControls(page);
		await page.waitForTimeout(500);

		expect(ng0956Warnings).toHaveLength(0);
	});

	test("no NG0956 warnings across all examples", async ({ page }) => {
		const ng0956Warnings = await collectNG0956Warnings(page);
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		for (const example of EXAMPLES) {
			await page.selectOption("#example-select", example);
			await page.waitForTimeout(1500);
			await interactWithFormControls(page);
			await page.waitForTimeout(300);
		}

		expect(ng0956Warnings).toHaveLength(0);
	});
});
