# k6-performance-tests

## Summary

Automated end-to-end API and UI performance tests and measurement recordings.
It uses the [k6](https://k6.io) automation framework.

All code is written in [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html) and [ESM](https://dev.to/abbeyperini/tldr-commonjs-vs-esm-47dk), and linted by [ESLint](https://eslint.org/docs/latest/use/core-concepts/) and [Prettier](https://prettier.io/docs/en/).

## Prerequisites

- Node.js (use the latest LTS version)
- [k6 (see linked instructions)](https://grafana.com/docs/k6/latest/set-up/install-k6/)

## Quick Start

### READ FIRST

k6 is **NOT** a Node.js package, nor does it officially support Node.js dependencies. Please read these
instructions carefully to ensure the framework runs as expected, as the commands are complex, must be written **EXACTLY**
as described, and vary significantly depending on what you're trying to do.

### Instructions

1. Clone this repository (`git clone git@github.com:Jmelwood/k6-performance-tests.git`)
2. Navigate to the root of the folder and install the dependencies (`cd k6-performance-tests && npm i`)
3. Run a particular performance script with the following command: `npm run start:local -- src/tests/<file>.spec.ts`
   1. Environment variables (as listed below) are specified in a **unique** way for k6, by including them as flags **after**
      the `--` and **before** the file name, ie. `npm run start:local -- -e SCENARIO=load-average src/tests/<file>.spec.ts`.
   2. k6 requires specifying a file name to run; to go through each performance test script one by one, use the `./run-all.sh`
      script in the following manner: `./run-all.sh "<full regular command>"` (ie. `./run-all.sh "npm run start:local --"`).
      You may include environment variables after the `--` (and always include `--` regardless), but do not include any file names.
   3. A variety of other configuration flags can be set to override defaults; [read about them here](https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/).

## Environment Variables

All environment variables are optional (they overwrite default values or specify additional setup):

- `K6_BINARY_PATH`: If your custom k6 binary is not in your `PATH`, you can specify the absolute or relative
  path to the binary manually.
- `WEB_URL`: Override what the base URL is for the UI/website.
- `API_URL`: Override what the base URL is for the API gateway.
- `SCENARIO`: There are various load test types to choose from, as detailed below. Specify the option to use; by
  default, it will use `smoke`. Other options include `load-average`, `load-constant`, `spike`, `stress`, `soak`, and `breakpoint`.
- `INCLUDE_UI`: Specify this variable if you have written an additional function named `frontend`, alongside the default function.
  The expectation is that there is code in this additional `frontend` function that uses the `k6/browser` library, as a
  Chromium headless browser will be opened after a 10 second delay to run this function. The function will be run as if
  it were a functional smoke test (ie. only 1 iteration), with the goal of verifiyng the UI still works when the API is under stress.

### k6 Usage

#### Beginner's Guide: START HERE

[**IF YOU HAVE NEVER USED K6 BEFORE, PLEASE READ EVERY MODULE WRITTEN HERE**](https://github.com/grafana/k6-learn/tree/main/Modules)\
[If you prefer to learn interactively, this workshop will teach the same materials.](https://github.com/grafana/k6-oss-workshop)

Additional resources:

- [Official k6 docs](https://grafana.com/docs/k6/latest/)
- Testing/playground sites (for experiments and learning not suited to run against our own products/environments):
  - [API 1](https://test-api.k6.io/)
  - [API 2](https://httpbin.test.k6.io/)
  - [UI](https://test.k6.io/)
- [Load test types](https://grafana.com/docs/k6/latest/testing-guides/test-types/) (ie. load, stress, soak, breakpoint, etc.)
- [Open-model vs closed-model executors](https://medium.com/ibm-data-ai/benchmark-design-9245395e8609)

#### File structure

A typical performance test script should follow this template:

```ts
import { browser } from 'k6/browser';
import type { Options } from 'k6/options';

import constants from '../utility/constants.ts';

/**
 * Writing code outside a function (global) is init code.
 * It runs once before setup, once per VU before VU code, and once before teardown.
 * Not all k6 features are available for use in the init section;
 * for example, you cannot make HTTP requests within init code.
 */

let firstIteration = true;

export const options: Options = {
  scenarios: {
    [constants.k6ScenarioChoice]: constants.k6Scenarios[constants.k6ScenarioChoice],
    ...(__ENV.INCLUDE_UI && { ui: constants.k6Scenarios.ui })
  }
};

export function setup() {
  // The setup function will execute only once across all VUs, before any VU code.
  // It is executed right after the init code. The full k6 API is available during setup, including making HTTP requests.
}

export default function () {
  if (firstIteration) {
    // This code runs only once per VU, after the setup code but before the rest of the VU code.
    firstIteration = false;
  }

  /* API test code goes here */
}

// Optional/additional function for a paired UI test
export async function frontend() {
  const page = await browser.newPage();
  try {
    await page.goto(constants.webUrl);
    /* UI test code goes here */
  } finally {
    await page.close();
  }
}

export function teardown() {
  // If the setup() function ends abnormally, the teardown() function isn't called.
}
```
