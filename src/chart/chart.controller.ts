import {CacheInterceptor, Controller, Get, Logger, Param, UseInterceptors} from "@nestjs/common";
import {ChartService} from "./chart.service";
import {MovieSummary} from "../database/chart.model";

@Controller('movie-chart')
// @UseInterceptors(CacheInterceptor)
export class ChartController {
    constructor(
        private chartService: ChartService
    ) {}

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

    @Get('daum/movies')
    public getAllChartByDaum() {
        this.logger.debug('getAllChartByDaum');
        return this.chartService.getAllChartByDaum();
    }
}
