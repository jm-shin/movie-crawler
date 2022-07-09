import {Inject, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
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
            console.log('테스팅 에러 발생');
            throw new InternalServerErrorException();
        }
    }
}
