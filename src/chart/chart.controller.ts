import { CacheInterceptor, Controller, Get, HttpCode, Logger, Param, Post, UseInterceptors } from '@nestjs/common';
import { ChartService } from './chart.service';
import { Movie, MovieSummary } from '../common/interface/movie.interface';
import {Observable} from "rxjs";

@UseInterceptors(CacheInterceptor)
@Controller('chart')
export class ChartController {
  constructor(
    private chartService: ChartService,
  ) {
  }

  // 다음 영화
  // 다음 영화 - 모든 영화 목록 & 상세 정보 스크래핑
  @Post('daum/movies')
  @HttpCode(200)
  public createDaumMovieCharts(): Promise<void | Awaited<Movie>[]> {
    return this.chartService.saveDaumMovieCharts();
  }

  // 다음 영화 - 상세 정보
  @Get('daum/movie/:movieId')
  getDaumMovieDetail(
    @Param('movieId') movieId: number,
  ): Observable<MovieSummary> {
    return this.chartService.findByDaumMovieId(movieId);
  }

  // 다음 영화 - 목록
  @Get('daum/summary')
  public getDaumMovieSummary(): Promise<MovieSummary[]> {
    return this.chartService.findAllDaumMovieSummary();
  }

  // 다음 영화 - 모든 목록 & 상세 정보
  @Get('daum/movies')
  public getAllDaumMovies(): Promise<Movie[]> {
    return this.chartService.findAllDaumMovie();
  }

  // 네이버 영화
  // 네이버 영화 - 모든 영화 목록 & 상세 정보 스크래핑
  @Post('naver/movies')
  @HttpCode(200)
  public createNaverMovieCharts(): Promise<Movie[]> {
    return this.chartService.saveNaverMovieCharts();
  }

  // 네이버 영화 - 상세 정보
  @Get('naver/movie/:movieId')
  public getNaverMovieDetail(
    @Param('movieId') movieId: number,
  ): Promise<MovieSummary> {
    return this.chartService.findByNaverMovieId(movieId);
  }

  // 네이버 영화 - 목록
  @Get('naver/summary')
  public getNaverMovieSummary(): Promise<MovieSummary[]> {
    return this.chartService.findAllNaverMovieSummary();
  }

  // 네이버 영화 - 모든 목록 & 상세 정보
  @Get('naver/movies')
  public getAllNaverMovies(): Promise<Movie[]> {
    return this.chartService.findAllNaverMovie();
  }

  // CGV 영화
  // CGV 영화 - 모든 영화 목록 & 상세정보 스크래핑
  @Post('cgv/movies')
  @HttpCode(200)
  public createCGVMovieCharts() {
    return this.chartService.saveCGVMovieCharts();
  }

  // CGV 영화 - 상세 정보
  @Get('cgv/movie/:movieId')
  public getCGVMovieDetail(
    @Param('movieId') movieId: number,
  ): Promise<MovieSummary> {
    return this.chartService.findByCGVMovieId(movieId);
  }

  // CGV 영화 - 목록
  @Get('cgv/summary')
  public getCGVMovieSummary(): Promise<MovieSummary[]> {
    return this.chartService.findAllCGVMovieSummary();
  }

  // CGV 영화 - 모든 목록 & 상세 정보
  @Get('cgv/movies')
  public getAllCGVMovies(): Promise<Movie[]> {
    return this.chartService.findAllCGVMovie();
  }
}
