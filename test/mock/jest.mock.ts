import { MockType } from './mock.type';
import { ChartService } from '../../dist/chart/chart.service';
import { JsonDB } from 'node-json-db';
import { ScrapService } from '../../dist/scrap/scrap.service';

export const ChartServiceFactory: () => MockType<ChartService> = jest.fn(
  () => ({
    saveDaumMovieCharts: jest.fn(),
    findByDaumMovieId: jest.fn(),
    findAllDaumMovieSummary: jest.fn(),
    findAllDaumMovie: jest.fn(),
    saveNaverMovieCharts: jest.fn(),
    findByNaverMovieId: jest.fn(),
    findAllNaverMovieSummary: jest.fn(),
    findAllNaverMovie: jest.fn(),
    saveCGVMovieCharts: jest.fn(),
    findByCGVMovieId: jest.fn(),
    findAllCGVMovieSummary: jest.fn(),
    findAllCGVMovie: jest.fn(),
  }),
);

export const ScrapServiceFactory: () => MockType<ScrapService> = jest.fn(
  () => ({
      scrapingMovieFromDaumMovie: jest.fn(),
      scrapingMovieFromNaverMovie: jest.fn(),
      scrapingMovieFromCGV: jest.fn(),
  }),
);

// @ts-ignore
export const repositoryMockFactory: () => MockType<JsonDB> = jest.fn(
  () => ({
    getObject: jest.fn(),
  }),
);