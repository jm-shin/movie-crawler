import {Inject, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {DATABASE_CONNECTION} from "../database/database.constants";
import {JsonDB} from "node-json-db";
import * as cheerio from 'cheerio';
import axios from "axios";
import {MovieSummary} from "../database/chart.model";

@Injectable()
export class ChartService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: JsonDB
    ) {
    }

    public async getChart(): Promise<MovieSummary[]> {

        const array: MovieSummary[] = [
            {
                name: "정이라고 하자 (Feat. 10CM)",
                runningTime: 102,
                openDate: new Date('2022-07-09'),
            },
            {
                name: "TOMBOY",
                runningTime: 101,
                openDate: new Date('202-07-10'),
            }
        ];

        await this.db.push("/chart", array);

        const result = this.db.getObject<MovieSummary[]>("/chart");

        if (result === null) {
            throw new NotFoundException();
        }

        console.log(result);
        return result;
    }

    public async testingCheerio() {
        try {
            //cheerio
            const response = await axios.get('https://movie.naver.com/movie/running/current.nhn');
            const $ = cheerio.load(response.data);
            const $movieList = $('div.lst_wrap ul.lst_detail_t1').children('li');

            let crawledMovie: any[] = [];
            const rank = 10;

            $movieList.each(function (i) {
                const summary = $(this).find('dd dl.info_txt1')
                    .text().replace(/\t/gi, '').replace(/\n/gi, '');

                const openDate = summary.match(/\d{4}.\d{2}.\d{2}/)?.toString();
                const runningTime = summary.match(/(?<=\|)(.*?)(?=분\|)/g)?.toString();

                const director = summary.match(/(?<=감독).*?(?=출연)/)?.toString().split(', ')
                const actor = summary.match(/(?<=출연).*/)?.toString().split(', ')

                crawledMovie[i] = {
                    index: i,
                    title: $(this).find('dt.tit a').text(),
                    runningTime: runningTime ? Number(runningTime) : 0,
                    openDate: openDate ? new Date(openDate) : null,
                    director: director,
                    actor: actor,
                };
            });

            const data = crawledMovie.filter(m => m.title);

            return data;
        } catch (err) {
            console.log('에러발생');
            throw new InternalServerErrorException();
        }
    }
}
