import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  use: {baseURL:'http://127.0.0.1:4300', viewport:{width:1440,height:1000}, trace:'retain-on-failure'},
  webServer: {command:'npm run preview', url:'http://127.0.0.1:4300', reuseExistingServer:!process.env.CI},
  reporter: [['list'], ['html', {open:'never'}]],
});
