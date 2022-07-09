import {Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {DATABASE_CONNECTION} from "../database/database.constants";
import {JsonDB} from "node-json-db";
import axios from "axios";
import * as cheerio from "cheerio";
import {ScrapInterface} from "./scrap.interface";

@Injectable()
export class ScrapService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: JsonDB,
    ) {
    }

    public async scrapAndSave() {
        let crawledMovie: ScrapInterface[] = [];

        await axios.get('https://movie.naver.com/movie/running/current.nhn').then((response) => {
            const $ = cheerio.load(response.data);
            const $movieList = $('div.lst_wrap ul.lst_detail_t1').children('li');
            $movieList.each(function (i) {
                const summary = $(this).find('dd dl.info_txt1')
                    .text().replace(/\t/gi, '').replace(/\n/gi, '');
                const openDate = summary.match(/\d{4}.\d{2}.\d{2}/)?.toString();
                const runningTime = summary.match(/(?<=\|)(.*?)(?=분\|)/g)?.toString();
                const director = summary.match(/(?<=감독).*?(?=출연)/)?.toString().split(', ');
                const actor = summary.match(/(?<=출연).*/)?.toString().split(', ');

                crawledMovie[i] = {
                    index: i,
                    title: $(this).find('dt.tit a').text(),
                    runningTime: runningTime ? Number(runningTime) : 0,
                    openDate: openDate ? new Date(openDate) : null,
                    director: director,
                    actor: actor,
                };
            });
        }).catch((error) => {
            console.log(`${error} 같은 사유로 크롤링에 실패하였습니다.`);
            throw new InternalServerErrorException();
        });

        const result = crawledMovie.filter(m => m.title);

        try {
            await this.db.push('/chart/naver', result);
        } catch (error) {
            console.log('로컬 디비 저장에 실패하였습니다.')
        }

        return result;
    }
}
