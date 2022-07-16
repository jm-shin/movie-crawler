import { Test, TestingModule } from '@nestjs/testing';
import { ChartService } from './chart.service';
import { ChartServiceFactory } from '../../test/mock/jest.mock';
import { MockType } from '../../test/mock/mock.type';
import { ChartController } from './chart.controller';
import { CacheModule, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Movie, MovieDetail, MovieSummary } from '../common/interface/movie.interface';

const movies: Movie[] = [{
  'id': 0,
  'name': '탑건: 매버릭',
  'runningTime': null,
  'openDate': new Date('2022-06-01'),
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
    'openDate': new Date('2022-07-05T15:00:00.000Z'),
    'director': ['타이카 와이티티'],
    'actor': ['크리스 헴스워스', '나탈리 포트만', '테사 톰슨', '크리스찬 베일', '타이카 와이티티', '크리스 프랫'],
  }];

const movieSummary: MovieSummary[] = [
  {
    "id": 7,
    "name": "헤어질 결심",
    "runningTime": 138,
    "openDate": new Date("2022-06-28T15:00:00.000Z")
  },
  {
    "id": 8,
    "name": "위대한 침묵",
    "runningTime": 124,
    "openDate": new Date("2022-06-28T15:00:00.000Z")
  },
]

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

  describe('Chart Controller create', () => {
    describe('createDaumMovieCharts', () => {
      it('should have a funtcion', () => {
        expect(typeof controller.createDaumMovieCharts).toBe('function');
      });
      it('should call saveDaumMovieCharts return movies', async () => {
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
      it('should call createNaverMovieCharts return movies', async () => {
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
      it('should call createCGVMovieCharts return movies', async () => {
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

  describe('Chart Controller Get', () => {
    describe('getDaumMovieDetail', () => {
      it('should have a getDaumMovieDetail function', () => {
        expect(typeof controller.getDaumMovieDetail).toBe('function');
      });
      it('getDaumMovieDetail 성공이라면 한번 호출.', async () => {
        await controller.getDaumMovieDetail(0);
        expect(chartServiceMock.findByDaumMovieId).toHaveBeenCalledTimes(1);
      });
      it('movieId와 일치하는 결과가 있으면 반환한다.', async () => {
        chartServiceMock.findByDaumMovieId.mockReturnValue(movies[0]);
        expect(await controller.getDaumMovieDetail(0)).toBe(movies[0]);
      });
      it('movieId와 일치하는 결과가 없으면 404 NotFoundException', async () => {
        chartServiceMock.findByDaumMovieId.mockReturnValue(NotFoundException);
        try {
          await controller.getDaumMovieDetail(2);
        } catch (error) {
          expect(error).toThrowError(NotFoundException);
          expect(error).toBeInstanceOf(404);
        }
      });
    });

    describe('getDaumMovieSummary', () => {
      it('should have a getDaumMovieSummary function', () => {
        expect(typeof controller.getDaumMovieSummary).toBe('function');
      });
      it('호출 시, findAllDaumMovieSummary가 한번 호출된다. ', async () => {
        await controller.getDaumMovieSummary();
        expect(chartServiceMock.findAllDaumMovieSummary).toHaveBeenCalledTimes(1);
      });
      it('should return movieSummary', async () => {
        chartServiceMock.findAllDaumMovieSummary.mockReturnValue(movieSummary);
        expect(await controller.getDaumMovieSummary()).toBe(movieSummary);
      });
    });

    describe('getAllDaumMovies', () => {
      it('should have a getAllDaumMovies function', () => {
        expect(typeof controller.getAllDaumMovies).toBe('function');
      });
      it('호출 시, findAllDaumMovieSummary가 한번 호출된다. ', async () => {
        await controller.getAllDaumMovies();
        expect(chartServiceMock.findAllDaumMovie).toHaveBeenCalledTimes(1);
      });
      it('should return all movies', async () => {
        chartServiceMock.findAllDaumMovie.mockReturnValue(movies);
        expect(await controller.getAllDaumMovies()).toBe(movies);
      });
    });

    describe('getNaverMovieDetail', () => {
      it('should have a getNaverMovieDetail function', () => {
        expect(typeof controller.getNaverMovieDetail).toBe('function');
      });
      it('호출 시, findByNaverMovieId가 한번 호출된다. ', async () => {
        await controller.getNaverMovieDetail(1);
        expect(chartServiceMock.findByNaverMovieId).toHaveBeenCalledTimes(1);
      });
      it('movieId와 일치하는 결과가 있으면 반환한다.', async () => {
        chartServiceMock.findByNaverMovieId.mockReturnValue(movies[0]);
        expect(await controller.getNaverMovieDetail(0)).toBe(movies[0]);
      });
      it('movieId와 일치하는 결과가 없으면 404 NotFoundException', async () => {
        chartServiceMock.findByNaverMovieId.mockReturnValue(NotFoundException);
        try {
          await controller.getNaverMovieDetail(2);
        } catch (error) {
          expect(error).toThrowError(NotFoundException);
          expect(error).toBeInstanceOf(404);
        }
      });

    });

    describe('getNaverMovieSummary', () => {
      it('should have a getNaverMovieSummary function', () => {
        expect(typeof controller.getNaverMovieSummary).toBe('function');
      });
      it('호출 시, findAllNaverMovie가 한번 호출된다.', async () => {
        await controller.getNaverMovieSummary();
        expect(chartServiceMock.findAllNaverMovieSummary).toHaveBeenCalledTimes(1);
      });
      it('should return movie summary', async () => {
        chartServiceMock.findAllNaverMovieSummary.mockReturnValue(movieSummary);
        expect(await controller.getNaverMovieSummary()).toBe(movieSummary);
      });
    });

    describe('getAllNaverMovies', () => {
      it('should have a getAllNaverMovies function', () => {
        expect(typeof controller.getAllNaverMovies).toBe('function');
      });
      it('호출 시, findAllNaverMovie가 한번 호출된다.', async () => {
        await controller.getAllNaverMovies();
        expect(chartServiceMock.findAllNaverMovie).toHaveBeenCalledTimes(1);
      });
      it('should return all movies', async () => {
        chartServiceMock.findAllNaverMovie.mockReturnValue(movies);
        expect(await controller.getAllNaverMovies()).toBe(movies);
      });
    });


    describe('getCGVMovieDetail', () => {
      it('should have a function', () => {
        expect(typeof controller.getCGVMovieDetail).toBe('function');
      });
      it('호출 시, findAllNaverMovie가 한번 호출된다.', async () => {
        await controller.getCGVMovieDetail(1);
        expect(chartServiceMock.findByCGVMovieId).toHaveBeenCalledTimes(1);
      });
      it('movieId와 일치하는 결과가 있으면 반환한다.', async () => {
        chartServiceMock.findByCGVMovieId.mockReturnValue(movies[0]);
        expect(await controller.getCGVMovieDetail(0)).toBe(movies[0]);
      });
      it('movieId와 일치하는 결과가 없으면 404 NotFoundException', async () => {
        chartServiceMock.findByCGVMovieId.mockReturnValue(NotFoundException);
        try {
          await controller.getCGVMovieDetail(2);
        } catch (error) {
          expect(error).toThrowError(NotFoundException);
          expect(error).toBeInstanceOf(404);
        }
      });
    });

    describe('getCGVMovieSummary', () => {
      it('should have a function', () => {
        expect(typeof controller.getCGVMovieSummary).toBe('function');
      });
      it('호출 시, findAllCGVMovieSummary가 한번 호출된다.', async () => {
        await controller.getCGVMovieSummary();
        expect(chartServiceMock.findAllCGVMovieSummary).toHaveBeenCalledTimes(1);
      });
      it('should return movies summary', async () => {
        chartServiceMock.findAllCGVMovieSummary.mockReturnValue(movieSummary);
        expect(await controller.getCGVMovieSummary()).toBe(movieSummary);
      });
    });

    describe('getAllCGVMovies', () => {
      it('should have a getAllCGVMovies function', () => {
        expect(typeof controller.getAllCGVMovies).toBe('function');
      });
      it('호출 시, findAllCGVMovie가 한번 호출된다.', async () => {
        await controller.getAllCGVMovies();
        expect(chartServiceMock.findAllCGVMovie).toHaveBeenCalledTimes(1);
      });
      it('should return movies summary', async () => {
        chartServiceMock.findAllCGVMovie.mockReturnValue(movies);
        expect(await controller.getAllCGVMovies()).toBe(movies);
      });
    });
  });
});