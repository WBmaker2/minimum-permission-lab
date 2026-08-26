import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://127.0.0.1:44173',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 44173 --strictPort',
    url: 'http://127.0.0.1:44173',
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-375',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 812 },
      },
    },
  ],
})
