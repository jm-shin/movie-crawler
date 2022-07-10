import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ChartModule} from './chart/chart.module';
import {DatabaseModule} from './database/database.module';
import {ScrapModule} from './scrap/scrap.module';
import {ScheduleModule} from "@nestjs/schedule";
import {LoggerMiddleware} from "./common/middleware/logger.middleware";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ChartModule,
        DatabaseModule,
        ScrapModule,
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('*');
    }
}
