import {Inject, Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {DATABASE_CONNECTION} from "../database/database.constants";
import {JsonDB} from "node-json-db";
import axios from "axios";
import * as cheerio from "cheerio";
import {ScrapInterface} from "./scrap.interface";
import {DaumMovieSummary, Movie} from "../common/interface/movie.interface";

@Injectable()
export class ScrapService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: JsonDB
    ) {
    }

    private readonly logger = new Logger(ScrapService.name);

    // 다음영화 - 현재 개봉작
    public async scrapingMovieListFromDaumMovie(): Promise<void | Awaited<Movie | { success: boolean }>[]> {
        try {
            const promiseUrls = await axios.get("https://movie.daum.net/api/premovie?page=1&size=35&flag=Y", {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                    'Referer': 'https://movie.daum.net/premovie/theater'
                }
            }).then((response) => {
                return response.data.contents.map((movie: DaumMovieSummary) => {
                    return `https://movie.daum.net/api/movie/${movie.id}/main`;
                });
            })

            //TODO: openDate string > Date parse
            function fetchData(URL: string) {
                return axios.get(URL)
                    .then(function (response) {
                        const movie = response.data
                        return {
                            id: movie.movieCommon?.id,
                            name: movie.movieCommon?.titleKorean,
                            runningTime: movie.movieCommon?.countryMovieInformation[0]?.duration,
                            openDate: movie.movieCommon?.countryMovieInformation[0]?.releaseDate,
                            director: movie.casts?.filter((v: { movieJob: { role: string; }; }) => v.movieJob.role == '감독')
                                .map((director: { nameKorean: string; }) => director.nameKorean),
                            actor: movie.casts?.filter((v: { movieJob: { role: string; }; }) => v.movieJob.role == '주연' || v.movieJob.role == '출연')
                                .map((actor: { nameKorean: string; }) => actor.nameKorean),
                        };
                    })
                    .catch(function (error) {
                        return {success: false};
                    });
            }

            function getAllData(URLs: string[]) {
                return Promise.all(URLs.map(fetchData));
            }

            const movieResult = await getAllData(promiseUrls)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    this.logger.error(error);
                });

            if (movieResult) {
                try {
                    await this.db.push("/chart/daum", movieResult);
                } catch (error) {
                    this.logger.error('movie list save fail!');
                }
            }

            return movieResult;
        } catch (error) {
            this.logger.error(`${error} 같은 사유로 크롤링에 실패하였습니다.`);
            throw new InternalServerErrorException();
        }
    }//

    public async scrapingMovieListFromNaverMovie(): Promise<Movie[]> {

        this.logger.debug("start scrapingMovieListFromNaverMovie...");

        let crawledMovie: Movie[] = [];

        await axios.get("https://movie.naver.com/movie/running/current.nhn").then((response) => {
            const $ = cheerio.load(response.data);
            const $movieList = $("div.lst_wrap ul.lst_detail_t1").children("li");
            $movieList.each(function (i) {
                const summary = $(this).find("dd dl.info_txt1").text()
                    .replace(/\t/gi, "").replace(/\n/gi, "");
                const openDate = summary.match(/\d{4}.\d{2}.\d{2}/)?.toString();
                const runningTime = summary.match(/(?<=\|)(.*?)(?=분\|)/g)?.toString();
                const director = summary.match(/(?<=감독).*?(?=출연)/)?.toString().split(", ");
                const actor = summary.match(/(?<=출연).*/)?.toString().split(", ");

                crawledMovie[i] = {
                    id: i,
                    name: $(this).find("dt.tit a").text(),
                    runningTime: runningTime ? Number(runningTime) : 0,
                    openDate: openDate ? new Date(openDate) : new Date(),
                    director: director ? director : [],
                    actor: actor ? actor : [],
                };
            });
        }).catch((error) => {
            this.logger.error(`${error} fail.`);
            throw new InternalServerErrorException();
        });

        const result = crawledMovie.filter(m => m.name);

        try {
            await this.db.push("/chart/naver", result);
        } catch (error) {
            this.logger.error("naver movie list save fail!");
        }
        return result;
    }//


    public async scrapingMovieListFromCGV() {
        this.logger.debug("Called scrapCGVMovies function");

        const movieIndex: any[] = [];

        await axios.get("http://www.cgv.co.kr/movies/").then((response) => {
            const $ = cheerio.load(response.data);
            const $movieChart = $("div.sect-movie-chart ol").children("li");

            $movieChart.each(function (i) {
                movieIndex[i] =
                    $(this).find("div.box-contents a[href*=\"/movies/\"]")
                        .attr("href")?.toString().replace("/movies/detail-view/?midx=", "");
            });
        }).catch((error) => {
            this.logger.error(`${error} scraping fail!`);
            throw new InternalServerErrorException();
        });

        const uniqueMovieIndex = movieIndex.filter((value => value != null));

        const promiseUrls = uniqueMovieIndex.map((idx) => {
            return `http://www.cgv.co.kr/movies/detail-view/?midx=${idx}`;
        });

        function getAllData(URLs: string[]) {
            return Promise.all(URLs.map(fetchData));
        }

        function fetchData(URL: string) {
            return axios.get(URL)
                .then(function (response) {
                    const $ = cheerio.load(response.data);
                    const $contents = $('div.sect-base-movie div.box-contents div.spec dl');
                    return {
                        id: Number($('#menu div.col-detail ul li.on a').attr('href')?.match(/(?<=midx=).*?(?=#menu)/)),
                        name: $('div.sect-base-movie div.box-contents div.title strong').text(),
                        director: $contents.find("dd:nth-child(2) a").text(),
                        actor: $contents.find("dd.on").first().text()
                            .replace(/\t/gi, '').replace(/\n/gi, '').replace(/ /gi, '').split(', '),
                        runningTime: Number($contents.find('dd').text()
                            .match(/(?<=, ).*?(?=분, )/gi)?.toString()),
                        openDate: $contents.text().replace(/\t/gi, '').replace(/\n/gi, '')
                            .replace(/ /gi, '').match(/\d{4}.\d{2}.\d{2}/)?.toString(),
                    };
                })
                .catch(function (error) {
                    return {success: false};
                });
        }

        const movieResult = await getAllData(promiseUrls)
            .then((response) => {
                return response;
            })
            .catch(e => {
                this.logger.error(e);
            });

        try {
            await this.db.push("/chart/cgv", movieResult);
        } catch (error) {
            this.logger.error(error);
            throw new NotFoundException();
        }

        return movieResult;
    }//
}
