import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import * as request from 'supertest';
import {AppModule} from "../src/app.module";

describe('API e2e test', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('네이버 영화 크롤링', () => {
        it('/chart/naver/movies (POST) should return 200', async () => {
            const res = await request(app.getHttpServer())
                .post('/chart/naver/movies')
                .send();
            expect(res.status).toBe(200);
        });
        it('/chart/naver/movie/:movieId (GET) if none existing should return 404', async () => {
            const id = 1000;
            const res = await request(app.getHttpServer()).get('/chart/naver/movie/' + id);
            expect(res.status).toBe(404);
        });
    });

    describe('다음 영화 크롤링', () => {
        it('/chart/daum/movies (POST) should return 200', async () => {
            const res = await request(app.getHttpServer())
                .post('/chart/daum/movies')
                .send();
            expect(res.status).toBe(200);
        });
        it('/chart/daum/movie/:movieId (GET) if none existing should return 404', async () => {
            const id = 1000;
            const res = await request(app.getHttpServer()).get('/chart/daum/movie/' + id);
            expect(res.status).toBe(404);
        });
    });

    describe('CGV 영화 크롤링', () => {
        it('/chart/cgv/movies (POST) should return 200', async () => {
            const res = await request(app.getHttpServer())
                .post('/chart/cgv/movies')
                .send();
            expect(res.status).toBe(200);
        });
        it('/chart/cgv/movie/:movieId (GET) if none existing should return 404', async () => {
            const id = 1000;
            const res = await request(app.getHttpServer()).get('/chart/cgv/movie/' + id);
            expect(res.status).toBe(404);
        });
    });
});