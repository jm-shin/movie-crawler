import { Test, TestingModule } from '@nestjs/testing';
import { ChartService } from './chart.service';
import { MockType } from '../../test/mock/mock.type';
import { JsonDB } from 'node-json-db';
import { repositoryMockFactory, ScrapServiceFactory } from '../../test/mock/jest.mock';
import { DatabaseModule } from '../database/database.module';
import { ScrapService } from '../scrap/scrap.service';
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

  it('should get daum movies', async () => {
    scrapService.scrapingMovieFromDaumMovie.mockReturnValue([]);
    const daumMovies = await service.saveDaumMovieCharts();
    expect(daumMovies).toEqual([]);
  });

  it('should get naver movies', async () => {
    scrapService.scrapingMovieFromNaverMovie.mockReturnValue([]);
    const naverMovies = await service.saveNaverMovieCharts();
    expect(naverMovies).toEqual([]);
  });

  it('should get cgv movies', async () => {
    scrapService.scrapingMovieFromCGV.mockReturnValue([]);
    const cgvMovies = await service.saveCGVMovieCharts();
    expect(cgvMovies).toEqual([]);
  });

  it('if not found throw an NotFoundException', async () => {
    repositoryMock.getObject.mockReturnValueOnce(movies);

  });
});