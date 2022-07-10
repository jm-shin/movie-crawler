# Nest-Next Web Crawler

## Installation

```bash
$ npm install

$ npm run build
```

## Running the app

```bash
$ npm run start

# watch mode
$ npm run dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 기능 명세

vendor는 "daum" | "naver" | "cgv" 입니다.

|URL|method|description|
|---|---|---|
|POST|/movie-chart/${vendor}/movies|모든 영화 정보 스크래핑|
|GET|/movie-chart/${vendor}/movie/${movieId}|영화 상세정보|
|GET|/movie-chart/${vendor}/summary|영화 목록|
|GET|/movie-chart/${vendor}/movies|모든 영화 목록 & 상세정보|
