import { Module } from '@nestjs/common';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { AppController } from './app.controller';
import { ChartModule } from './chart/chart.module';
import { DatabaseModule } from './database/database.module';
import { ScrapModule } from './scrap/scrap.module';

@Module({
  imports: [
    RenderModule.forRootAsync(
      Next({
        dev: process.env.NODE_ENV !== 'production',
        conf: { useFilesystemPublicRoutes: false },
      }),
    ),
    ChartModule,
    DatabaseModule,
    ScrapModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
