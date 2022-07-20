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

    describe('네이버 영화 크롤링(/chart/naver/movies)', () => {
        it('should success return 200', async () => {
            const res = await request(app.getHttpServer())
                .post('/chart/naver/movies')
                .send();
            expect(res.status).toBe(200);
        });
    });
});