import type { Scenario as K6Scenario } from 'k6/options';

const webUrl = __ENV.WEB_URL ?? 'https://test.k6.io';
const apiUrl = __ENV.API_URL ?? 'https://test-api.k6.io';

const k6Scenarios: Record<string, K6Scenario> = {
  smoke: {
    executor: 'shared-iterations',
    vus: 1,
    iterations: 1
  },
  spike: {
    executor: 'per-vu-iterations',
    vus: 1000,
    iterations: 1
  },
  'load-average': {
    executor: 'ramping-vus',
    stages: [
      { duration: '2m', target: 150 },
      { duration: '30m', target: 225 },
      { duration: '2m', target: 0 }
    ]
  },
  'load-constant': {
    executor: 'constant-vus',
    duration: '30s',
    vus: 150
  },
  stress: {
    executor: 'ramping-vus',
    stages: [
      { duration: '2m', target: 300 },
      { duration: '15m', target: 500 },
      { duration: '2m', target: 0 }
    ]
  },
  soak: {
    executor: 'ramping-vus',
    stages: [
      { duration: '2m', target: 150 },
      { duration: '8h', target: 150 },
      { duration: '2m', target: 0 }
    ]
  },
  breakpoint: {
    executor: 'ramping-arrival-rate',
    preAllocatedVUs: 0,
    stages: [{ duration: '2h', target: 1000 }]
  },
  ui: {
    executor: 'shared-iterations',
    exec: 'frontend',
    iterations: 1,
    startTime: '10s', // add a delay to let the API calls begin
    options: {
      browser: {
        type: 'chromium'
      }
    }
  }
};

export const constants = Object.freeze({
  webUrl,
  apiUrl,
  k6Scenarios,
  k6ScenarioChoice: __ENV.SCENARIO ?? 'smoke'
});

export default constants;
