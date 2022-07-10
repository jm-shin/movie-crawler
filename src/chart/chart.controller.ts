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

    // 모든 영화 목록 & 상세정보 크롤링
    @Get('naver/movies')
    public getAllCharts() {
        this.logger.debug('start! getHtml');
        return this.chartService.testingCheerio();
    }

    // 상세 정보
    @Get('naver/movie/:movieId')
    public getChartDetail(
        @Param('movieId') movieId: number,
    ): Promise<MovieSummary> {
        console.log(`find index: ${movieId}`);
        return this.chartService.getChartDetail(movieId);
    }

    @Get('cgv/movies')
    public getAllChartByCGV() {
        this.logger.debug('getAllChartByCGV');
        return this.chartService.getAllChartByCGV();
    }
    
    //다음 영화
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
}
