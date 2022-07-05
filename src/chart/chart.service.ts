import {Inject, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {DATABASE_CONNECTION} from "../database/database.constants";
import {JsonDB} from "node-json-db";
import {Chart} from "../database/chart.model";
import * as cheerio from 'cheerio';
import axios from "axios";

@Injectable()
export class ChartService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: JsonDB
    ) {
    }

    public async getChart(): Promise<Chart[]> {

        const array: Chart[] = [
            {
                title: "정이라고 하자 (Feat. 10CM)",
                singer: 'BIG Naughty (서동현)',
                album: '정이라고 하자',
            },
            {
                title: "TOMBOY",
                singer: '(여자)아이들',
                album: 'I NEVER DIE',
            }
        ];

        await this.db.push("/chart", array);

        const result = this.db.getObject<Chart[]>("/chart");

        if (result === null) {
            throw new NotFoundException();
        }

        console.log(result);
        return result;
    }

    public async testingCheerio() {
        try {
            //cheerio
            const response = await axios.get('https://www.melon.com/chart/index.htm');
            const $ = cheerio.load(response.data);
            // const result = $.html();
            const $result = $('div#tb_list tbody').html();
            return $result;
        } catch (err) {
            console.log('에러발생');
            throw new InternalServerErrorException();
        }
    }
}
