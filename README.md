# Web-Automation Developer 사전과제_영화목록

다음은 구현한 내용입니다.

- TypeScript로 구현
- axios, nest.js, jest, node-json-db를 활용
- cheerio 사용
- winston을 사용하여 middleware 방식으로 로깅
- cache-manager를 사용해 GET 메서드 캐싱 (3분)
- unit test
- cron. 매 30분마다 스크래핑 후 local db에 저장.
- 별도의 POST 메서드. 사용자가 조작할 수 있는 스크래핑 기능 추가

## 기능 명세

vendor는 "daum" | "naver" | "cgv" 입니다.

|URL|method|description|
|---|---|---|
|POST|/movie-chart/${vendor}/movies|모든 영화 정보 스크래핑|
|GET|/movie-chart/${vendor}/movie/${movieId}|영화 상세정보|
|GET|/movie-chart/${vendor}/summary|영화 목록|
|GET|/movie-chart/${vendor}/movies|모든 영화 목록 & 상세정보|

## 설치

```bash
$ npm install

$ npm run build
```

## 앱 실행

```bash
$ npm run start

# watch mode
$ npm run dev
```

## 테스트

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 프로젝트 구조

````
.
├── .gitignore
├── .prettierrc
├── localDataBase.json
├── nodemon.json
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
├── tslint.json
├── src
│   ├── chart
│   │     ├── chart.controller.spec.ts
│   │     ├── chart.controller.ts
│   │     ├── chart.module.ts
│   │     ├── chart.service.spec.ts
│   │     └── chart.service.ts
│   ├── common
│   │     ├── interface
│   │     │     └── movie.interface.ts
│   │     ├── middleware
│   │     │     ├── logger.middleware.ts
│   │     │     └── logger.service.ts
│   ├── database
│   │     ├── database.constants.ts
│   │     ├── database.module.ts
│   │     └── database-connection.providers.ts
│   ├── scrap
│   │     ├── scrap.constants.ts
│   │     ├── scrap.interface.ts
│   │     ├── scrap.module.ts
│   │     ├── scrap.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test
│     ├── mock
│     │   │   jest.mock.ts
│     │   └── mock.type.json
````