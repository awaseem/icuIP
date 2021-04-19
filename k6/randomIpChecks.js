// This is a K6 file for loading testing this service
// For more information on how to run this, follow the installation guide: https://k6.io/docs/getting-started/installation
// Once you've installed it, run 'k6 run randomIpChecks.js' with an instance running on docker or locally

import { check } from 'k6'
import http from 'k6/http'

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 2500,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 1000, // how large the initial pool of VUs would be
      maxVUs: 10000, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(99)<100'], // 99% of requests should be below 100ms
  },
}

export default function () {
  const ip =
    Math.floor(Math.random() * 255) +
    1 +
    '.' +
    Math.floor(Math.random() * 255) +
    '.' +
    Math.floor(Math.random() * 255) +
    '.' +
    Math.floor(Math.random() * 255)

  const url = `http://localhost:8080/v1/check/${ip}`
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const res = http.get(url, params)
  check(res, {
    'is status 200': (r) => r.status === 200,
  })
}
