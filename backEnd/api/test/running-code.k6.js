import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  executor: 'ramping-arrival-rate', //Assure load increase if the system slows
  stages: [
    { duration: '2m', target: 20000 }, // just slowly ramp-up to a HUGE load
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: [{ threshold: 'p(99) < 4000', abortOnFail: true }],
  },
};

export default function () {
  // const data = { "code" : "cnt=0\nfor i in range(10):\n    cnt+=i\nprint(cnt)" } ;
  const data = { code: "print('cnt')" };
  let res = http.post('http://localhost:4000/run/v2', data);
  // let res = http.post('http://localhost:4000/run/v1', data);

  check(res, {
    'status is 200': (r) => r.status === 200 || r.status === 201,
  });

  sleep(0.5);
}
