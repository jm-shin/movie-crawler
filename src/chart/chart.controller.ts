import {Controller, Get, Query} from "@nestjs/common";
import {ChartService} from "./chart.service";
import type {Chart} from "../database/chart.model";

@Controller('chart')
export class ChartController {
    constructor(private chartService: ChartService) {
    }

    @Get('')
    public getAllCharts(
        @Query('sort') sort: string = '100',
    ): Promise<Chart[]> {
        console.log(sort);
        return this.chartService.getChart();
    }

    @Get('test')
    public getHtml() {
        console.log('start! getHtml');
        return this.chartService.testingCheerio();
    }
}
