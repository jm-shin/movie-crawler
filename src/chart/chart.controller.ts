import {CacheInterceptor, Controller, Get, Logger, Param, Post, UseInterceptors} from "@nestjs/common";
import {ChartService} from "./chart.service";
import {MovieSummary} from "../database/chart.model";

@Controller('movie-chart')
// @UseInterceptors(CacheInterceptor)
export class ChartController {
    constructor(
        private chartService: ChartService
    ) {
    }

    private readonly logger = new Logger(ChartController.name);
    
    // CGV
    @Get('cgv/movies')
    public getAllChartByCGV() {
        this.logger.debug('getAllChartByCGV');
        return this.chartService.getAllChartByCGV();
    }
    
    // 다음 영화
    // 다음 영화 스크래핑
    @Post('daum/movies')
    public createDaumMovieCharts() {
        this.logger.debug('start scrapingMovieListFromDaumMoive');
        return this.chartService.saveDaumMovieCharts();
    }

    // 다음 상세정보
    @Get('daum/movie/:movieId')
    public getDaumMovieDetail(
        @Param('movieId') movieId: number,
    ) {
        this.logger.debug('start getDaumMovieDetail');
        return this.chartService.findByDaumMovieId(movieId);
    }

    // 다음 영화 목록
    @Get('daum/summary')
    public getDaumMovieSummary() {
        this.logger.debug('start getDaumMovieSummary');
        return this.chartService.findAllDaumMovieSummary();
    }
    
    // 다음 모든 영화 목록 & 상세정보
    @Get('daum/movies')
    public getAllDaumMovies() {
        this.logger.debug('start getAllDaumMovies');
        return this.chartService.findAllDaumMovie();
    }

    // 네이버 영화
    // 네이버 영화 모든 영화 목록 & 상세정보 크롤링
    @Post('naver/movies')
    public createNaverMovieCharts() {
        this.logger.debug('start! getHtml');
        return this.chartService.saveNaverMovieCharts();
    }

    // 네이버 영화 상세 정보
    @Get('naver/movie/:movieId')
    public getNaverMovieDetail(
        @Param('movieId') movieId: number,
    ): Promise<MovieSummary> {
        console.log(`find id: ${movieId}`);
        return this.chartService.findByNaverMovieId(movieId);
    }

    // 네이버 영화 목록
    @Get('naver/summary')
    public getNaverMovieSummary() {
        this.logger.debug('start getNaverMovieSummary');
        return this.chartService.findAllNaverMovieSummary();
    }

    // 네이버 모든 영화 목록 & 상세보기
    @Get('naver/movies')
    public getAllNaverMovies() {
        this.logger.debug('start getAllNaverMovies...');
        return this.chartService.findAllNaverMovie();
    }
}
