import {Inject, Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {DATABASE_CONNECTION} from "../database/database.constants";
import {JsonDB} from "node-json-db";
import {MovieSummary} from "../database/chart.model";
import {ScrapService} from "../scrap/scrap.service";

@Injectable()
export class ChartService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: JsonDB,
        private readonly scrapService: ScrapService
    ) {
    }

    private readonly logger = new Logger(ChartService.name);

    public async getChartDetail(movieId: number): Promise<MovieSummary> {

        const result: MovieSummary[] = this.db.getObject<MovieSummary[]>("/chart/naver");

        if (result === null) {
            throw new NotFoundException();
        }

        return result[movieId];
    }

    public async testingCheerio() {
        try {
            return await this.scrapService.scrapAndSave();
        } catch (err) {
            this.logger.error('testingCheerio error!');
            throw new InternalServerErrorException();
        }
    }

    public async getAllChartByCGV() {
        try {
            return await this.scrapService.scrapCGVMovies();
        } catch (err) {
            this.logger.error('getAllChartByCGV error!');
            throw new InternalServerErrorException();
        }
    }

    public async getAllChartByDaum() {
        try {
            // return await this.scrapService.scrapDaumMoiveSummary();
        } catch (error) {
            this.logger.error('getAllChartByDaum error!');
            throw new InternalServerErrorException();
        }
    }

    // new daum
    // 다음영화 스크래핑
    public async saveDaumMovieCharts() {
        try {
            this.logger.debug('start saveDaumMovieCharts');
            return await this.scrapService.scrapingMovieListFromDaumMovie();
        } catch (error) {
            this.logger.error('saveDaumMovieCharts error!');
        }
    }

    // 상세정보(id)
    public async findByDaumMovieId(movieId: number): Promise<any> {
        try {
            // db 조회
            const movieList = this.db.getObject<any[]>("/chart/daum");
            return movieList.filter((movie) => movie.id == movieId)[0];
        } catch (error) {
            this.logger.error('saveDaumMovieCharts error!');
        }
    }

    // 영화 목록
    public async findAllDaumMovieSummary() {
        try {
            this.logger.debug('start findAllDaumMovieSummary');
            const movieList = this.db.getObject<any[]>("/chart/daum");
            return movieList.map((movieInfo) => {
               return {
                   id: movieInfo.id,
                   name: movieInfo.name,
                   runningTime:movieInfo.runningTime,
                   openDate:movieInfo.openDate,
               }
            });
        } catch (error) {
            this.logger.error('saveDaumMovieCharts error!');
            throw new NotFoundException();
        }
    }

    // 모든 다음 영화 목록 & 상세정보
    public async findAllDaumMovie() {
        try {
            this.logger.debug('start findAllDaumMovie');
            return this.db.getObject<any[]>("/chart/daum");
        } catch (error) {
            this.logger.error('saveDaumMovieCharts error!');
            throw new NotFoundException();
        }
    }
}
