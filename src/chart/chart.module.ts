import { Module } from '@nestjs/common';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { DatabaseModule } from "../database/database.module";
import {ScrapModule} from "../scrap/scrap.module";

@Module({
  imports: [DatabaseModule, ScrapModule],
  controllers: [ChartController],
  providers: [ChartService]
})
export class ChartModule {}
