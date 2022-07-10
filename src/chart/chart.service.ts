import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database.constants';
import { JsonDB } from 'node-json-db';
import { Movie, MovieSummary } from '../common/interface/movie.interface';
import { ScrapService } from '../scrap/scrap.service';

@Injectable()
export class ChartService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: JsonDB,
    private readonly scrapService: ScrapService,
  ) {
  }

  private readonly logger = new Logger(ChartService.name);

  // 다음영화 스크래핑
  public async saveDaumMovieCharts(): Promise<void | Awaited<Movie>[]> {
    try {
      this.logger.debug('start saveDaumMovieCharts');
      return await this.scrapService.scrapingMovieFromDaum();
    } catch (error) {
      this.logger.error('saveDaumMovieCharts error!');
      throw new InternalServerErrorException();
    }
  }

  // 상세정보(id)
  public async findByDaumMovieId(movieId: number): Promise<MovieSummary> {
    try {
      // db 조회
      const movieList = this.db.getObject<Movie[]>('/chart/daum');
      return movieList.filter((movie) => movie.id == movieId)[0];
    } catch (error) {
      this.logger.error('saveDaumMovieCharts error!');
      throw new NotFoundException();
    }
  }

  // 영화 목록
  public async findAllDaumMovieSummary(): Promise<MovieSummary[]> {
    try {
      this.logger.debug('start findAllDaumMovieSummary');
      const movieList = this.db.getObject<Movie[]>('/chart/daum');
      return movieList.map((movieInfo) => {
        return {
          id: movieInfo.id,
          name: movieInfo.name,
          runningTime: movieInfo.runningTime,
          openDate: movieInfo.openDate,
        };
      });
    } catch (error) {
      this.logger.error('saveDaumMovieCharts error!');
      throw new NotFoundException();
    }
  }

  // 모든 다음 영화 목록 & 상세정보
  public async findAllDaumMovie(): Promise<Movie[]> {
    try {
      this.logger.debug('start findAllDaumMovie');
      return this.db.getObject<Movie[]>('/chart/daum');
    } catch (error) {
      this.logger.error('saveDaumMovieCharts error!');
      throw new NotFoundException();
    }
  }

  // 네이버
  // 네이버 영화 스크래핑
  public async saveNaverMovieCharts(): Promise<Movie[]> {
    try {
      return await this.scrapService.scrapingMovieFromNaver();
    } catch (err) {
      this.logger.error('testingCheerio error!');
      throw new InternalServerErrorException();
    }
  }

  // 네이버 영화 상세정보
  public async findByNaverMovieId(movieId: number): Promise<MovieSummary> {
    try {
      const result: Movie[] = this.db.getObject<Movie[]>('/chart/naver');
      return result[movieId];
    } catch (error) {
      throw new NotFoundException();
    }
  }

  // 네이버 영화 목록
  public async findAllNaverMovieSummary(): Promise<MovieSummary[]> {
    try {
      this.logger.debug('start findAllNaverMovieSummary...');
      const movieList = this.db.getObject<Movie[]>('/chart/naver');
      return movieList.map((movieInfo) => {
        return {
          id: movieInfo.id,
          name: movieInfo.name,
          runningTime: movieInfo.runningTime,
          openDate: movieInfo.openDate,
        };
      });
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  // 네이버 모든 영화 목록 & 상세 정보
  public async findAllNaverMovie(): Promise<Movie[]> {
    try {
      this.logger.debug('start findAllNaverMovie...');
      return this.db.getObject<Movie[]>('/chart/naver');
    } catch (error) {
      this.logger.error('saveDaumMovieCharts error!');
      throw new NotFoundException();
    }
  }

  // CGV
  // CGV 영화 목록 스크래핑
  public async saveCGVMovieCharts() {
    try {
      return await this.scrapService.scrapingMovieFromCGV();
    } catch (err) {
      this.logger.error('getAllChartByCGV error!');
      throw new InternalServerErrorException();
    }
  }

  // CGV 영화 상세보기
  public async findByCGVMovieId(movieId: number): Promise<MovieSummary> {
    try {
      this.logger.debug('start findByCGVMovieId...');
      const result: Movie[] = this.db.getObject<Movie[]>('/chart/cgv');
      return result[movieId];
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  // CGV 영화 목록
  public async findAllCGVMovieSummary(): Promise<MovieSummary[]> {
    try {
      this.logger.debug('start findAllCGVMovieSummary...');
      const movieList = this.db.getObject<Movie[]>('/chart/cgv');
      return movieList.map((movieInfo) => {
        return {
          id: movieInfo.id,
          name: movieInfo.name,
          runningTime: movieInfo.runningTime,
          openDate: movieInfo.openDate,
        };
      });
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  // 모든 CGV 영화 목록 & 상세보기
  public async findAllCGVMovie(): Promise<Movie[]> {
    try {
      this.logger.debug('start findAllCGVMovie...');
      return this.db.getObject<Movie[]>('/chart/cgv');
    } catch (error) {
      this.logger.error('saveDaumMovieCharts error!');
      throw new NotFoundException();
    }
  }
}
