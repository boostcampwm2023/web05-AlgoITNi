import { parentPort } from 'worker_threads';
import * as os from 'os';

function calculateCpuUsage() {
  const cpus = os.cpus();
  let totalIdleTime = 0;
  let totalWorkTime = 0;

  for (const cpu of cpus) {
    for (const type in cpu.times) {
      totalWorkTime += cpu.times[type];
    }
    totalIdleTime += cpu.times.idle;
  }

  const totalUsage = 100 - (100 * totalIdleTime) / totalWorkTime;
  parentPort?.postMessage(totalUsage);
}

setInterval(calculateCpuUsage, 5000);
