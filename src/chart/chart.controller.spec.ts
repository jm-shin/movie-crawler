import { Test, TestingModule } from '@nestjs/testing';
import { ChartService } from './chart.service';
import { ChartServiceFactory } from '../../test/mock/jest.mock';
import { MockType } from '../../test/mock/mock.type';
import { ChartController } from './chart.controller';
import { CacheModule, InternalServerErrorException } from '@nestjs/common';
import { Movie } from '../common/interface/movie.interface';

const movies: Movie[] = [{
  'id': 0,
  'name': '탑건: 매버릭',
  'runningTime': null,
  'openDate': '2022.06.01',
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
    'openDate': '2022-07-05T15:00:00.000Z',
    'director': ['타이카 와이티티'],
    'actor': ['크리스 헴스워스', '나탈리 포트만', '테사 톰슨', '크리스찬 베일', '타이카 와이티티', '크리스 프랫'],
  }];

describe('ChartController', () => {
  let controller: ChartController;
  let chartServiceMock: MockType<ChartService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ ttl: 60 })],
      controllers: [ChartController],
      providers: [
        {
          provide: ChartService,
          useFactory: ChartServiceFactory,
        },
      ],
    }).compile();
    controller = module.get<ChartController>(ChartController);
    chartServiceMock = module.get(ChartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    describe('createDaumMovieCharts', () => {
      it('should have a funtcion', () => {
        expect(typeof controller.createDaumMovieCharts).toBe('function');
      });
      it('should call saveDaumMovieCharts', async () => {
        chartServiceMock.saveDaumMovieCharts.mockReturnValue(movies);
        expect(await controller.createDaumMovieCharts()).toBe(movies);
      });
      it('createDaumMovieCharts 성공이라면 한번 호출.', async () => {
        await controller.createDaumMovieCharts();
        expect(chartServiceMock.saveDaumMovieCharts).toHaveBeenCalledTimes(1);
      });
      it('should return InternalServerErrorException 500 error', async () => {
        chartServiceMock.saveDaumMovieCharts.mockReturnValue(InternalServerErrorException);
        try {
          await controller.createDaumMovieCharts();
        } catch (error) {
          expect(error).toThrowError(InternalServerErrorException);
          expect(error).toBeInstanceOf(500);
        }
      });
    });

    describe('createNaverMovieCharts', () => {
      it('should have a createNaverMovieCharts funtcion', () => {
        expect(typeof controller.createNaverMovieCharts).toBe('function');
      });
      it('should call createNaverMovieCharts', async () => {
        chartServiceMock.saveNaverMovieCharts.mockReturnValue(movies);
        expect(await controller.createNaverMovieCharts()).toBe(movies);
      });
      it('createNaverMovieCharts 성공이라면 한번 호출.', async () => {
        await controller.createNaverMovieCharts();
        expect(chartServiceMock.saveNaverMovieCharts).toHaveBeenCalledTimes(1);
      });
      it('should return InternalServerErrorException 500 error', async () => {
        chartServiceMock.saveNaverMovieCharts.mockReturnValue(InternalServerErrorException);
        try {
          await controller.createNaverMovieCharts();
        } catch (error) {
          expect(error).toThrowError(InternalServerErrorException);
          expect(error).toBeInstanceOf(500);
        }
      });
    });

    describe('createCGVMovieCharts', () => {
      it('should have a createCGVMovieCharts funtcion', () => {
        expect(typeof controller.createCGVMovieCharts).toBe('function');
      });
      it('should call createCGVMovieCharts', async () => {
        chartServiceMock.saveCGVMovieCharts.mockReturnValue(movies);
        expect(await controller.createCGVMovieCharts()).toBe(movies);
      });
      it('createCGVMovieCharts 성공이라면 한번 호출.', async () => {
        await controller.createCGVMovieCharts();
        expect(chartServiceMock.saveCGVMovieCharts).toHaveBeenCalledTimes(1);
      });
      it('should return InternalServerErrorException 500 error', async () => {
        chartServiceMock.saveCGVMovieCharts.mockReturnValue(InternalServerErrorException);
        try {
          await controller.createCGVMovieCharts();
        } catch (error) {
          expect(error).toThrowError(InternalServerErrorException);
          expect(error).toBeInstanceOf(500);
        }
      });
    });

  });

  describe('get', () => {
    describe('getDaumMovieDetail', () => {
      it('should have a getDaumMovieDetail function', () => {
        expect(typeof controller.getDaumMovieDetail).toBe('function');
      });
    });

    describe('getDaumMovieSummary', () => {
      it('should have a getDaumMovieSummary function', () => {
        expect(typeof controller.getDaumMovieSummary).toBe('function');
      });
    });

    describe('getAllDaumMovies', () => {
      it('should have a getAllDaumMovies function', () => {
        expect(typeof controller.getAllDaumMovies).toBe('function');
      });
    });

    describe('getNaverMovieDetail', () => {
      it('should have a getNaverMovieDetail function', () => {
        expect(typeof controller.getNaverMovieDetail).toBe('function');
      });
    });

    describe('getNaverMovieSummary', () => {
      it('should have a getNaverMovieSummary function', () => {
        expect(typeof controller.getNaverMovieSummary).toBe('function');
      });
    });

    describe('getAllNaverMovies', () => {
      it('should have a getAllNaverMovies function', () => {
        expect(typeof controller.getAllNaverMovies).toBe('function');
      });
    });


    describe('getCGVMovieDetail', () => {
      it('should have a function', () => {
        expect(typeof controller.getCGVMovieDetail).toBe('function');
      });
    });

    describe('getCGVMovieSummary', () => {
      it('should have a function', () => {
        expect(typeof controller.getCGVMovieSummary).toBe('function');
      });
    });

    describe('getAllCGVMovies', () => {
      it('should have a getAllCGVMovies function', () => {
        expect(typeof controller.getAllCGVMovies).toBe('function');
      });

    });
  });
});