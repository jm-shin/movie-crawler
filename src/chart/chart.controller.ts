import {CacheInterceptor, Controller, Get, Logger, Param, Post, UseInterceptors} from "@nestjs/common";
import {ChartService} from "./chart.service";
import {Movie, MovieSummary} from "../common/interface/movie.interface";

@Controller('movie-chart')
export class ChartController {
    constructor(
        private chartService: ChartService
    ) {}

    private readonly logger = new Logger(ChartController.name);

    @UseInterceptors(CacheInterceptor)
    @Get('myname')
    public myName() {
        console.log('my name is....');
        return 'jongmin';
    }

    @UseInterceptors(CacheInterceptor)
    @Post('myname')
    public myName2() {
        console.log('my name is....');
        return 'jongmin';
    }

    // 다음 영화
    // 다음 영화 스크래핑
    @UseInterceptors(CacheInterceptor)
    @Post('daum/movies')
    public createDaumMovieCharts(): Promise<void | Awaited<Movie | { success: boolean }>[]> {
        this.logger.debug('start scrapingMovieListFromDaumMoive');
        return this.chartService.saveDaumMovieCharts();
    }

    // 다음 상세정보
    @Get('daum/movie/:movieId')
    public getDaumMovieDetail(
        @Param('movieId') movieId: number,
    ): Promise<MovieSummary> {
        this.logger.debug('start getDaumMovieDetail');
        return this.chartService.findByDaumMovieId(movieId);
    }

    // 다음 영화 목록
    @Get('daum/summary')
    public getDaumMovieSummary(): Promise<MovieSummary[]> {
        this.logger.debug('start getDaumMovieSummary');
        return this.chartService.findAllDaumMovieSummary();
    }

    // 다음 모든 영화 목록 & 상세정보
    @Get('daum/movies')
    public getAllDaumMovies(): Promise<Movie[]> {
        this.logger.debug('start getAllDaumMovies');
        return this.chartService.findAllDaumMovie();
    }

    // 네이버 영화
    // 네이버 영화 모든 영화 목록 & 상세정보 크롤링
    @UseInterceptors(CacheInterceptor)
    @Post('naver/movies')
    public createNaverMovieCharts(): Promise<Movie[]> {
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
    public getNaverMovieSummary(): Promise<MovieSummary[]> {
        this.logger.debug('start getNaverMovieSummary');
        return this.chartService.findAllNaverMovieSummary();
    }

    // 네이버 모든 영화 목록 & 상세보기
    @Get('naver/movies')
    public getAllNaverMovies(): Promise<Movie[]> {
        this.logger.debug('start getAllNaverMovies...');
        return this.chartService.findAllNaverMovie();
    }

    // CGV
    // CGV 영화 스크래핑
    @UseInterceptors(CacheInterceptor)
    @Post('cgv/movies')
    public createCGVMovieCharts() {
        this.logger.debug('createCGVMovieCharts');
        return this.chartService.saveCGVMovieCharts();
    }

    // CGV 영화 상세 정보
    @Get('cgv/movie/:movieId')
    public getCGVMovieDetail(
        @Param('movieId') movieId: number,
    ): Promise<MovieSummary> {
        console.log(`find id: ${movieId}`);
        return this.chartService.findByCGVMovieId(movieId);
    }

    // CGV 영화 목록
    @Get('cgv/summary')
    public getCGVMovieSummary(): Promise<MovieSummary[]> {
        this.logger.debug('start getCGVMovieSummary...');
        return this.chartService.findAllCGVMovieSummary();
    }

    // CGV 모든 영화
    @Get('cgv/movies')
    public getAllCGVMovies(): Promise<Movie[]> {
        this.logger.debug('start getAllCGVMovies...');
        return this.chartService.findAllCGVMovie();
    }
}
