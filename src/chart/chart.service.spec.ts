import {Test, TestingModule} from '@nestjs/testing';
import {ChartService} from './chart.service';
import {MockType} from '../../test/mock/mock.type';
import {JsonDB} from 'node-json-db';
import {ScrapServiceFactory} from '../../test/mock/jest.mock';
import {DatabaseModule} from '../database/database.module';
import {ScrapService} from '../scrap/scrap.service';
import {Movie} from '../common/interface/movie.interface';
import {InternalServerErrorException} from '@nestjs/common';
import {Config} from "node-json-db/dist/lib/JsonDBConfig";

const movies: Movie[] = [{
    'id': 114329,
    'name': '탑건: 매버릭',
    'runningTime': null,
    'openDate': '2020-12-23T00:00:00.000Z',
    'director': [
        '조셉 코신스키',
    ],
    'actor': [
        '톰 크루즈',
        '마일스 텔러',
        '제니퍼 코넬리',
        '발 킬머',
        '바쉬르 살라후딘',
        '존 햄',
        '찰스 파넬',
        '모니카 바바로',
        '루이스 풀먼',
    ],
},
    {
        'id': 1,
        'name': '토르: 러브 앤 썬더',
        'runningTime': 119,
        'openDate': new Date('2022-07-05'),
        'director': ['타이카 와이티티'],
        'actor': ['크리스 헴스워스', '나탈리 포트만', '테사 톰슨', '크리스찬 베일', '타이카 와이티티', '크리스 프랫'],
    }];

describe('ChartService', () => {
    let service: ChartService;
    let repositoryMock: MockType<JsonDB>;
    let scrapService: MockType<ScrapService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [
                ChartService,
                {
                    provide: JsonDB,
                    useFactory: () => {
                        const db = new JsonDB(new Config("localDataBase", true, false, '/'));
                        return db;
                    },
                },
                {
                    provide: ScrapService,
                    useFactory: ScrapServiceFactory,
                },
            ],
        }).compile();

        service = module.get<ChartService>(ChartService);
        repositoryMock = module.get(JsonDB);
        scrapService = module.get(ScrapService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('saveDaumMovieCharts', () => {
        it('should get daum movies', async () => {
            scrapService.scrapingMovieFromDaum.mockReturnValue([]);
            expect(await service.saveDaumMovieCharts()).toEqual([]);
        });
        it('호출 시, scrapingMovieFromDaum는 한번 호출된다.', async () => {
            await service.saveDaumMovieCharts();
            expect(scrapService.scrapingMovieFromDaum).toHaveBeenCalledTimes(1);
        });
        it('성공시, movies를 리턴한다.', async () => {
            scrapService.scrapingMovieFromDaum.mockReturnValue(movies);
            await expect(service.saveDaumMovieCharts()).resolves.toBe(movies);
        });
        it('스크랩 실패시, 500 에러를 반환', async () => {
            scrapService.scrapingMovieFromDaum.mockReturnValue(InternalServerErrorException);
            try {
                await expect(service.saveDaumMovieCharts());
            } catch (error) {
                expect(error).toThrowError(InternalServerErrorException);
                expect(error).toBeInstanceOf(500);
            }
        });
    });

    describe('saveNaverMovieCharts', () => {
        it('should get naver movies', async () => {
            scrapService.scrapingMovieFromNaver.mockReturnValue([]);
            expect(await service.saveNaverMovieCharts()).toEqual([]);
        });
        it('호출 시, scrapingMovieFromNaver는 한번 호출된다.', async () => {
            await service.saveNaverMovieCharts();
            expect(scrapService.scrapingMovieFromNaver).toHaveBeenCalledTimes(1);
        });
        it('성공시, movies를 리턴한다.', async () => {
            scrapService.scrapingMovieFromNaver.mockReturnValue(movies);
            await expect(service.saveNaverMovieCharts()).resolves.toBe(movies);
        });
        it('스크랩 실패시, 500 에러를 반환', async () => {
            scrapService.scrapingMovieFromNaver.mockReturnValue(InternalServerErrorException);
            try {
                await expect(service.saveNaverMovieCharts());
            } catch (error) {
                expect(error).toThrowError(InternalServerErrorException);
                expect(error).toBeInstanceOf(500);
            }
        });
    });

    describe('saveCGVMovieCharts', () => {
        it('should get cgv movies', async () => {
            scrapService.scrapingMovieFromCGV.mockReturnValue([]);
            expect(await service.saveCGVMovieCharts()).toEqual([]);
        });
        it('호출 시, scrapingMovieFromCGV는 한번 호출된다.', async () => {
            await service.saveCGVMovieCharts();
            expect(scrapService.scrapingMovieFromCGV).toHaveBeenCalledTimes(1);
        });
        it('성공시, movies를 리턴한다.', async () => {
            scrapService.scrapingMovieFromCGV.mockReturnValue(movies);
            await expect(service.saveCGVMovieCharts()).resolves.toBe(movies);
        });
        it('스크랩 실패시, 500 에러를 반환', async () => {
            scrapService.scrapingMovieFromCGV.mockReturnValue(InternalServerErrorException);
            try {
                await expect(service.saveCGVMovieCharts());
            } catch (error) {
                expect(error).toThrowError(InternalServerErrorException);
                expect(error).toBeInstanceOf(500);
            }
        });
    });

    describe('findByDaumMovieId', () => {
        it('should have a findByDaumMovieId function', () => {
            expect(typeof service.findByDaumMovieId).toBe('function');
        });
        it('특정 아이디로 다음영화를 검색해야한다.', async () => {
            expect(service.findByDaumMovieId(114329).subscribe({
                next: (data) => {
                    expect(data).toBe(movies[0]);
                },
                error: (error) => console.log(error),
            }));
        });
        it('id 검색 결과 필드는 6개여야 한다.', () => {
            const movieResult = service.findByDaumMovieId(114329).subscribe();
            const len = Object.keys(movieResult).length;
            expect(len).toStrictEqual(6);
        });
    });

    describe('findAllDaumMovieSummary', () => {
        it('should have a findAllDaumMovieSummary function', () => {
            expect(typeof service.findAllDaumMovieSummary).toBe('function');
        });
        it('summary 검색은 필드가 4개여야 합니다.', async () => {
           const movieSummary = await service.findAllDaumMovieSummary();
           const msLen = Object.keys(movieSummary[0]).length;
           expect(msLen).toEqual(4);
        });
    });

    describe('findAllDaumMovie', () => {
        it('should have a findAllDaumMovie function', () => {
            expect(typeof service.findAllDaumMovie).toBe('function');
        });
    });

    describe('findByNaverMovieId', () => {
        it('should have a findByNaverMovieId function', () => {
            expect(typeof service.findByNaverMovieId).toBe('function');
        });
    });

    describe('findAllNaverMovieSummary', () => {
        it('should have a findAllNaverMovieSummary function', () => {
            expect(typeof service.findAllNaverMovieSummary).toBe('function');
        });
    });

    describe('findAllNaverMovie', () => {
        it('should have a findAllNaverMovie function', () => {
            expect(typeof service.findAllNaverMovie).toBe('function');
        });
    });

    describe('findByCGVMovieId', () => {
        it('should have a findByCGVMovieId function', () => {
            expect(typeof service.findByCGVMovieId).toBe('function');
        });
    });

    describe('findAllCGVMovieSummary', () => {
        it('should have a findAllCGVMovieSummary function', () => {
            expect(typeof service.findAllCGVMovieSummary).toBe('function');
        });
    });

    describe('findAllCGVMovie', () => {
        it('should have a findAllCGVMovie function', () => {
            expect(typeof service.findAllCGVMovie).toBe('function');
        });
    });
});