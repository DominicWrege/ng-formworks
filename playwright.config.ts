import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	timeout: 60_000,
	retries: 0,
	use: {
		baseURL: "http://localhost:4200",
		trace: "on-first-retry",
		launchOptions: {
			executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
		},
	},
	webServer: {
		command: "pnpm run start",
		port: 4200,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
