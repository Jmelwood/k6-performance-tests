import { check, sleep } from 'k6';
import { browser } from 'k6/browser';
import http from 'k6/http';
import type { Options } from 'k6/options';

import constants from '../utility/constants.ts';

export const options: Options = {
  // discardResponseBodies: constants.k6ScenarioChoice !== 'smoke',
  scenarios: {
    [constants.k6ScenarioChoice]: constants.k6Scenarios[constants.k6ScenarioChoice],
    ...(__ENV.INCLUDE_UI && { ui: constants.k6Scenarios.ui })
  }
};

export default function () {
  const res = http.get(constants.apiUrl);
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(Math.random() * 5);
}

export async function frontend() {
  const page = await browser.newPage();

  try {
    await page.goto(constants.webUrl);
  } finally {
    await page.close();
  }
}
