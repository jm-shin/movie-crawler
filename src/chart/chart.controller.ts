import {Controller, Get, Param, Query} from "@nestjs/common";
import {ChartService} from "./chart.service";
import {MovieSummary} from "../database/chart.model";

@Controller('movie-chart')
export class ChartController {
    constructor(private chartService: ChartService) {
    }

    @Get('naver/movies')
    public getAllCharts() {
        console.log('start! getHtml');
        return this.chartService.testingCheerio();
    }

    @Get('naver/movie/:movieId')
    public getChartDetail(
        @Param('movieId') movieId: number,
    ): Promise<MovieSummary> {
        console.log(`find index: ${movieId}`);
        return this.chartService.getChartDetail(movieId);
    }


}
