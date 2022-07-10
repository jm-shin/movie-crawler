import { Test, TestingModule } from '@nestjs/testing';
import { ChartService } from './chart.service';
import { MockType } from '../../test/mock/mock.type';
import { JsonDB } from 'node-json-db';
import { repositoryMockFactory, ScrapServiceFactory } from '../../test/mock/jest.mock';
import { DatabaseModule } from '../database/database.module';
import { ScrapService } from '../scrap/scrap.service';
import { Movie } from '../common/interface/movie.interface';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

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
          useFactory: repositoryMockFactory,
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
    it('movieId와 일치하는 결과가 없으면 404 NotFoundException', async () => {
      repositoryMock.getObject.mockReturnValue(NotFoundException);
      try {
        await service.findByDaumMovieId(2);
      } catch (error) {
        expect(error).toThrowError(NotFoundException);
        expect(error).toBeInstanceOf(404);
      }
    });
  });

  describe('findAllDaumMovieSummary', () => {
    it('should have a findAllDaumMovieSummary function', () => {
      expect(typeof service.findAllDaumMovieSummary).toBe('function');
    });
    it('결과가 없으면 404 NotFoundException', async () => {
      repositoryMock.getObject.mockReturnValue(NotFoundException);
      try {
        await service.findAllDaumMovieSummary();
      } catch (error) {
        expect(error).toThrowError(NotFoundException);
        expect(error).toBeInstanceOf(404);
      }
    });
  });

  describe('findAllDaumMovie', () => {
    it('should have a findAllDaumMovie function', () => {
      expect(typeof service.findAllDaumMovie).toBe('function');
    });
    it('결과가 없으면 404 NotFoundException', async () => {
      repositoryMock.getObject.mockReturnValue(NotFoundException);
      try {
        await service.findAllDaumMovie();
      } catch (error) {
        expect(error).toThrowError(NotFoundException);
        expect(error).toBeInstanceOf(404);
      }
    });
  });

  describe('findByNaverMovieId', () => {
    it('should have a findByNaverMovieId function', () => {
      expect(typeof service.findByNaverMovieId).toBe('function');
    });
    it('결과가 없으면 404 NotFoundException', async () => {
      repositoryMock.getObject.mockReturnValue(NotFoundException);
      try {
        await service.findByNaverMovieId(5);
      } catch (error) {
        expect(error).toThrowError(NotFoundException);
        expect(error).toBeInstanceOf(404);
      }
    });
  });

  describe('findAllNaverMovieSummary', () => {
    it('should have a findAllNaverMovieSummary function', () => {
      expect(typeof service.findAllNaverMovieSummary).toBe('function');
    });
    it('결과가 없으면 404 NotFoundException', async () => {
      repositoryMock.getObject.mockReturnValue(NotFoundException);
      try {
        await service.findAllNaverMovieSummary();
      } catch (error) {
        expect(error).toThrowError(NotFoundException);
        expect(error).toBeInstanceOf(404);
      }
    });
  });

  describe('findAllNaverMovie', () => {
    it('should have a findAllNaverMovie function', () => {
      expect(typeof service.findAllNaverMovie).toBe('function');
    });
    it('결과가 없으면 404 NotFoundException', async () => {
      repositoryMock.getObject.mockReturnValue(NotFoundException);
      try {
        await service.findAllNaverMovie();
      } catch (error) {
        expect(error).toThrowError(NotFoundException);
        expect(error).toBeInstanceOf(404);
      }
    });
  });

  describe('findByCGVMovieId', () => {
    it('should have a findByCGVMovieId function', () => {
      expect(typeof service.findByCGVMovieId).toBe('function');
    });
    it('결과가 없으면 404 NotFoundException', async () => {
      repositoryMock.getObject.mockReturnValue(NotFoundException);
      try {
        await service.findByCGVMovieId(7);
      } catch (error) {
        expect(error).toThrowError(NotFoundException);
        expect(error).toBeInstanceOf(404);
      }
    });
  });

  describe('findAllCGVMovieSummary', () => {
    it('should have a findAllCGVMovieSummary function', () => {
      expect(typeof service.findAllCGVMovieSummary).toBe('function');
    });
    it('결과가 없으면 404 NotFoundException', async () => {
      repositoryMock.getObject.mockReturnValue(NotFoundException);
      try {
        await service.findAllCGVMovieSummary();
      } catch (error) {
        expect(error).toThrowError(NotFoundException);
        expect(error).toBeInstanceOf(404);
      }
    });
  });

  describe('findAllCGVMovie', () => {
    it('should have a findAllCGVMovie function', () => {
      expect(typeof service.findAllCGVMovie).toBe('function');
    });
    it('결과가 없으면 404 NotFoundException', async () => {
      repositoryMock.getObject.mockReturnValue(NotFoundException);
      try {
        await service.findAllCGVMovie();
      } catch (error) {
        expect(error).toThrowError(NotFoundException);
        expect(error).toBeInstanceOf(404);
      }
    });
  });

});