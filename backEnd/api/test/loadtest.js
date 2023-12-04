const { io } = require('socket.io-client');

const DURATION = 120 * 1000; // 120초
const MAX_CLIENTS = 100;
const ERROR_RATE = 0.1;
let total_request = 0;
let errorCount = 0;
let clientCount = 0;
let concurrentClients = 10;
const 소요시간 = [];

const URL = 'ws://localhost:4000/run';
const data = {
  code: 'console.log("Hello World")',
  language: 'javascript',
};

const printResult = () => {
  console.log('총 요청개수 : ', total_request);
  console.log('성공한 요청 개수 : ', 소요시간.length);
  console.log(
    '평균 소요 시간 : ',
    소요시간.reduce((p, c) => p + c, 0) / 소요시간.length,
  );
  console.log('최대 동시 요청 수 : ', concurrentClients - 10);
};

const createSingleClient = () => {
  // for demonstration purposes, some clients stay stuck in HTTP long-polling
  const start = Date.now();
  const socket = io(URL, {
    transport: ['websocket'],
  });

  let doneEventReceived = false;
  // Set a timeout of 6 seconds
  const timeId = setTimeout(() => {
    if (!doneEventReceived) {
      errorCount++;
      // console.log('Timeout: done event not received within 6 seconds.');
      socket.disconnect();
    }
  }, 6000);

  socket.on('connect', () => {
    // console.log('소켓이 연결되었습니다.');
    socket.emit('request', data);
  });

  socket.on('done', (data) => {
    // console.log(data); // 코드 실행 결과
    doneEventReceived = true;
    clearTimeout(timeId);
    소요시간.push(Date.now() - start);
    socket.disconnect();
  });
};

const createClient = () => {
  if (clientCount >= MAX_CLIENTS) {
    setTimeout(() => {
      console.log('Test Success');
      printResult();
      process.exit(1);
    }, 6000);
  }
  if (total_request * ERROR_RATE < errorCount) {
    setTimeout(() => {
      console.log('Test Done By error');
      printResult();
      process.exit(1);
    }, 6000);
  }

  console.log(`Create ${concurrentClients} VUs`);
  Array.from({ length: concurrentClients }, (v, i) => i).forEach(() => {
    createSingleClient();
  });

  total_request += concurrentClients;
  concurrentClients += 10; // 동시 실행 횟수를 10씩 증가
  clientCount++;

  setTimeout(createClient, 3000); // 1초 뒤에 다음 그룹의 클라이언트 생성 시작
};

createClient();

setTimeout(() => {
  console.log('duration done');
  printResult();
  process.exit(1); // Exit the process with an error code (1)
}, DURATION); // Set the timeout to 60 seconds
