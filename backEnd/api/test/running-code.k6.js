import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  executor: 'ramping-arrival-rate', //Assure load increase if the system slows
  stages: [
    { duration: '1h', target: 20000 }, // just slowly ramp-up to a HUGE load
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: [{ threshold: 'p(99) < 1000', abortOnFail: true }],
  },
};

export default function () {
  const data = { code: 'print(5)' };
  let res = http.post('http://61.97.185.12:8888/run', data);

  check(res, {
    'status is 200': (r) => r.status === 200 || r.status === 201,
  });

  sleep(0.3);
}
