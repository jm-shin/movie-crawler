import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database.constants';
import { JsonDB } from 'node-json-db';
import { Movie, MovieSummary } from '../common/interface/movie.interface';
import { ScrapService } from '../scrap/scrap.service';
import { DATABASE_DAUM, DATABASE_NAVER, DATABASE_CGV } from './chart.constants';

@Injectable()
export class ChartService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: JsonDB,
    private readonly scrapService: ScrapService,
  ) {
  }

  private readonly logger = new Logger(ChartService.name);

  public async saveDaumMovieCharts(): Promise<void | Awaited<Movie>[]> {
    try {
      return await this.scrapService.scrapingMovieFromDaum();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async findByDaumMovieId(movieId: number): Promise<MovieSummary> {
    try {
      const movieList = this.db.getObject<Movie[]>(DATABASE_DAUM);
      const result =  movieList.filter((movie) => movie.id == movieId)[0];
      if (!result) {
        throw new Error();
      }
      return result
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  public async findAllDaumMovieSummary(): Promise<MovieSummary[]> {
    try {
      const movieList = this.db.getObject<Movie[]>(DATABASE_DAUM);
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

  public async findAllDaumMovie(): Promise<Movie[]> {
    try {
      return this.db.getObject<Movie[]>(DATABASE_DAUM);
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  public async saveNaverMovieCharts(): Promise<Movie[]> {
    try {
      return await this.scrapService.scrapingMovieFromNaver();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async findByNaverMovieId(movieId: number): Promise<MovieSummary> {
    try {
      const movieList: Movie[] = this.db.getObject<Movie[]>(DATABASE_NAVER);
      if (!movieList[movieId]) {
          throw new Error();
      }
      return movieList[movieId];
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  public async findAllNaverMovieSummary(): Promise<MovieSummary[]> {
    try {
      const movieList = this.db.getObject<Movie[]>(DATABASE_NAVER);
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

  public async findAllNaverMovie(): Promise<Movie[]> {
    try {
      return this.db.getObject<Movie[]>(DATABASE_NAVER);
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  public async saveCGVMovieCharts() {
    try {
      return await this.scrapService.scrapingMovieFromCGV();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async findByCGVMovieId(movieId: number): Promise<MovieSummary> {
    try {
      const movieList: Movie[] = this.db.getObject<Movie[]>(DATABASE_CGV);
      const result = movieList.filter((movie) => movie.id == movieId)[0];
      if (!result) {
          throw new Error();
      }
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }

  public async findAllCGVMovieSummary(): Promise<MovieSummary[]> {
    try {
      const movieList = this.db.getObject<Movie[]>(DATABASE_CGV);
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

  public async findAllCGVMovie(): Promise<Movie[]> {
    try {
      return this.db.getObject<Movie[]>(DATABASE_CGV);
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException();
    }
  }
}
