<div align="center"> 
<img src="https://github.com/boostcampwm2023/web05-AlgoITNi/assets/84272873/5d587a3b-d76d-4990-adfb-bb0624d74deb">


<h3>동료들과 함께 소통하며 알고리즘 학습을 할 수 있는 플랫폼</h3>
<h5>🗝️ KeyWords<h5>
<p>#WebRTC #Socket #CRDT</p>
<br>
<div align="center">
    <img src="https://img.shields.io/badge/node-339933?&logo=node.js&logoColor=white">
    <img src="https://img.shields.io/badge/NestJS-E0234E?logo=NestJS&logoColor=white">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/MySQL-4479A1?logo=MySQL&logoColor=white"/>   
    <img src="https://img.shields.io/badge/MongoDB-339933?logo=MongoDB&logoColor=white"> 
    <img src="https://img.shields.io/badge/Redis-DC382D?logo=Redis&logoColor=white"> 
    <br>
    <img src="https://img.shields.io/badge/React-61DAFB?logo=React&logoColor=white">
    <img src="https://img.shields.io/badge/tailwindcss-DB7093?logo=tailwindcss&logoColor=white"> 
    <img src="https://img.shields.io/badge/Socket.io-010101?logo=Socket.io&logoColor=white"> 
    <img src="https://img.shields.io/badge/WebRTC-333333?logo=WebRTC&logoColor=white">
    <img src="https://img.shields.io/badge/zustand-333333?logo=zustand&logoColor=white">
    <img src="https://img.shields.io/badge/jest-944058?logo=jest&logoColor=white">
    <br>
    <img src="https://img.shields.io/badge/Docker-2496ED?logo=Docker&logoColor=white"> 
    <img src="https://img.shields.io/badge/Nginx-009639?logo=Nginx&logoColor=white">  
    <img src="https://img.shields.io/badge/Naver Cloud Platform-F9F9F9?logo=Naver"> 
    <img src="https://img.shields.io/badge/AWS S3-FF9900?logo=amazon-aws&logoColor=white"> 
    <img src="https://img.shields.io/badge/AWS CloudFront-5930B4?logo=amazon-aws&logoColor=white"> 
</div>
<br>
<a href="https://www.youtube.com/watch?v=0P9qkA3zlHk">🎥 데모영상</a>
</div>



---

# 🔎서버 아키텍처
![Untitled](https://github.com/boostcampwm2023/web05-AlgoITNi/assets/84272873/019fa58f-c8c0-47f3-87a9-ea7cf36722d0)


# 🔎 주요 기능

### 🐱 화상회의
방 생성 버튼으로 새롭게 방을 만들거나 공유받은 방 코드로 이미 있는 방에 참여할 수 있습니다.
![EnterRoom](https://github.com/boostcampwm2023/web05-AlgoITNi/assets/84272873/fea34177-cffe-4700-914c-a304d0302f51)

 동료들과 화상회의를 하며 소통할 수 있습니다. <br>
WebRTC P2P로 통신합시다. <br>
 ![4명입장](https://github.com/boostcampwm2023/web05-AlgoITNi/assets/84272873/323fc7d1-5b4e-455f-923d-5db5855a0146)


### 😎 코드 공동 편집
 코드 편집기를 통해 코드를 작성할 수 있습니다. <br>
CRDT로 공동편집을 구현해 참여한 사람들과 함께 편집할 수 있습니다.<br>
집단 지성을 발휘해보세요!

 ![crdt](https://github.com/boostcampwm2023/web05-AlgoITNi/assets/84272873/42d71ab8-da12-4288-9a5d-47f9524cce96)

###  📥 문제 보기 
문제의 링크를 입력해 문제를 보면서 풀이할 수 있습니다. <br>
크롤링을 통해서 입력한 링크를 가져옵니다.  <br>
백준 사이트를 가장 잘 보여줍니다.<br>
![showProm2](https://github.com/boostcampwm2023/web05-AlgoITNi/assets/84272873/c2174696-2465-47dd-b8ab-aa47c7e7abbc)

### 🐍 코드 실행
작성한 코드를 실행하고 실행 결과를 확인할 수 있습니다.<br>
소켓과 메세지 큐를 통해 코드 실행이 요청됩니다. <br>
지원 언어 : `Python` `Javascript` `Java` `C` `Swift` `Kotlin`

![running](https://github.com/boostcampwm2023/web05-AlgoITNi/assets/84272873/282bcc84-4045-49f6-a5f7-2e5995483e73)

### 💬 채팅
채팅을 통해서도 소통할 수 있습니다. 음성 채팅이 어려운 상황에서나 참고할 자료를 보낼 때 활용할 수 있습니다.  <br>
Pub/Sub을 활용해 다중 서버 환경에서도 채팅을 할 수 있습니다. <br>
채팅 중 **클로바X**에게 질문하고 답변 받을 수 있습니다.

![chat](https://github.com/boostcampwm2023/web05-AlgoITNi/assets/84272873/a8f14d69-863e-4c6f-8779-ee6422d2dcce)

# 🔎 기술적 도전
### 프론트엔드의 기술적 도전
- [코드 에디터에서의 공동편집을 위한 CRDT구현](https://energetic-palm-634.notion.site/4826739090cf431e829bd928fd46a297?v=09650c23000d477f828c92563f0c8368&pvs=4)
  - 3번의 시도와 구현, 문제해결기와 더 나은 기능을 위해 라이브러리를 도입한 이야기
- [홈화면 성능 최적화 도전하기](https://energetic-palm-634.notion.site/f7286ebaa50f484da0a88a37888f77dc?v=f46a3e1fd63e435c9b1f642d220888ac&pvs=40)
  - 더 나은 UX를 위해 홈화면 초기 렌더링 성능 약 14% 개선
- [수많은 모달을 관리하기 위한 공통 모달 만들기](https://energetic-palm-634.notion.site/23cca8a3b3b44fce9a9df4b0a7e70dcd?v=9c4c39359a0e445dbdc2b7cdb2d74c68&pvs=4)
    - 중첩 모달과 많은 모달들을 쉽고 효율적으로 관리하기위한 모달 시스템 만들기
### 백엔드의 기술적 도전
- [다중 서버 환경에서 코드 실행 동시 요청 처리하기](https://energetic-palm-634.notion.site/bfeb2b52f3f34fe2af9bf93f254f8f5c?v=82acb687cdb74475986d223ac753bf05&pvs=4)
  - 소켓, Message Queue, Pub/Sub을 도입하여 CPU 사용량 43%, Memory 사용량 21% 감소시킨 이야기
- [다중 소켓 서버 트래픽 관리하기](https://energetic-palm-634.notion.site/d243a71d17f94018bd94a6b825fddfe4?v=803c0b95332343e1918ee10ff269e4f6&pvs=4)
  - 중앙서버와 Pub/Sub 도입으로 트래픽 분산 & 확장에 자유로운 구조로 개선
- [DB 부하 분산하기](https://energetic-palm-634.notion.site/8c129aa38b2f40c784b7641d8941571d?v=340d00941d4641f9bc47ee292d9d9cf5&pvs=4)
  - Master DB CPU 사용룰 90% 감소 및 요청처리 95% 증가 
- [Nginx 캐싱으로 크롤링 속도 높이기](https://energetic-palm-634.notion.site/270f92cdadaa475aa3827b300c511172?v=d67c232d930549948bdd0ad4c306c14f&pvs=4)
  - 429 Error 및 InMemory 용량부족 해결 과정 (16만건 처리에 걸리는 시간 64% 감소)
- [도커 이미지 최적화](https://energetic-palm-634.notion.site/f35c15bc99a842a18ce095fa6bf1c806?v=efbb8ec67beb43b89792200fc1f3c9a1&pvs=4)
  - 도커 이미지 사이즈 85% 감소시킨 이야기

# 🔎 개발기
개발하면서 공부한 내용들과 고민 과정, 이유, 해결 방법을 기록했습니다.

[FE]
- [Web RTC를 이해해보자](https://energetic-palm-634.notion.site/Web-RTC-1e8d918a19be444da6b0656167df35a6?pvs=4)
- [S3, CloudFront로 OAC를 통해 프론트엔드 배포하기](https://energetic-palm-634.notion.site/FrontEnd-CICD-with-S3-Cloud-Front-64ac0d2dab194a04b14743d034deb1c5?pvs=4)
- [로컬 환경에서 쿠키 테스트하기](https://energetic-palm-634.notion.site/8f53abc52d6a4b72816fc4aa9c211de2?pvs=4)
- [채팅창에 쓰로틀링 적용하기](https://energetic-palm-634.notion.site/9e768460a8904a8e859ba13cab0f78c2?pvs=4)
- [쉘 스크립트로 디렉토리별 pre-commit 적용하기](https://energetic-palm-634.notion.site/pre-commit-a60bec2c72e440a2ad414a1ab4b18f29?pvs=4)

[BE]
- [세션을 활용해 로그인 후 원래위치로 돌아가기](https://energetic-palm-634.notion.site/d2f6157bdcef40a6a72eacbb28acb798?pvs=4)
- [Transaction 관심사 분리하기](https://energetic-palm-634.notion.site/AsyncLocalStorage-Transaction-34f42523c0ec43f4b633eb7944c0b29d?pvs=4)
- [SSL Termination을 통해 안전하게 HTTP 통신하기](https://energetic-palm-634.notion.site/SSL-Termination-HTTP-70c76949740f4452a2899fa1e617628a?pvs=4)
- [Blue-Green으로 무중단 배포하기](https://energetic-palm-634.notion.site/57396ff1e3174251ba2c7487ab070a53?pvs=4)
- [Clove X 도입하기](https://energetic-palm-634.notion.site/Clova-Studio-d990f41d3e814b708906e64fd4707a24?pvs=4)
- [서버에서 OAuth 처리하여 자원 보호하기](https://energetic-palm-634.notion.site/OAuth-2-0-2bc01496ac9c4ed6b0118642c887828d?pvs=4)

[👉 더 많은 기술정리 보러가기](https://www.notion.so/f4562ec49e0245d2b6ef203588c031ea?v=fbfeb754b1a4471e8ffc174a45c64346&pvs=4)


# 🔎 팀 소개

|                                    J065 서위영                                    |                                  J094 이동길                                   |                                 J126 이희경                                  |                                 J151 지승민                                  |
|:------------------------------------------------------------------------------:| :----------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
| <img src="https://avatars.githubusercontent.com/u/96584994?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/99241871?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/84272873?v=4" width="200"> | <img src="https://avatars.githubusercontent.com/u/87487149?v=4" width="200"> |
|                                 **Front-End**                                  |                                 **Front-End**                                  |                                 **Back-End**                                 |                                 **Back-End**                                 |
|                       [@HBSPS](https://github.com/HBSPS)                        |                       [@d0422](https://github.com/d0422)                        |                   [@HKLeeeee](https://github.com/HKLeeeee)                    |                  [@Gseungmin](https://github.com/Gseungmin)                   |

![AlgoITNi](https://github.com/boostcampwm2023/web05-AlgoITNi/assets/84272873/db73a539-bb3f-4cf0-af23-81e23adc6b17)


## 우리가 일하는 방식

- [그라운드 룰](https://energetic-palm-634.notion.site/1f2cbea527e341c7ad1c8fd84ed5104d?pvs=4)
- [깃 컨벤션](https://energetic-palm-634.notion.site/Git-Convention-8563596644404eb49148a940773d2be8?pvs=4)
- [게더타운 규칙](https://energetic-palm-634.notion.site/b3b67313c1f748e7b58abf99466b000b?pvs=4)


---
<a href="https://energetic-palm-634.notion.site/AlgoITNi-4d712d57a7be42bfb625d23d5eab5453?pvs=4">😽 Team Notion </a>
