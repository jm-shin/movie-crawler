import { Controller, Get } from "@nestjs/common";
import { ChartService } from "./chart.service";

@Controller('chart')
export class ChartController {
  constructor( private chartService: ChartService) {}

  @Get('')
  getAllCharts() {
    return this.chartService.getChart();
  }
}
