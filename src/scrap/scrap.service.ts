import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database.constants';
import { JsonDB } from 'node-json-db';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DaumMovieSummary, Movie } from '../common/interface/movie.interface';
import { TARGET_URL_CGV, TARGET_URL_CGV_SECOND, TARGET_URL_DAUM, TARGET_URL_NAVER } from './scrap.constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DATABASE_CGV, DATABASE_DAUM, DATABASE_NAVER } from '../chart/chart.constants';

@Injectable()
export class ScrapService {
  private readonly logger = new Logger(ScrapService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private db: JsonDB,
  ) {
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async scrapingMovieFromDaum(): Promise<void | Awaited<Movie>[]> {

    this.logger.debug('daum movie: start scraping');

    try {
      const promiseUrls = await axios.get(TARGET_URL_DAUM).then((response) => {
        return response.data.contents.map((movie: DaumMovieSummary) => {
          return `https://movie.daum.net/api/movie/${movie.id}/main`;
        });
      });

      function fetchData(URL: string) {
        return axios.get(URL)
          .then(function(response) {
            const movie = response.data;
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
          });
      }

      function getAllData(URLs: string[]) {
        return Promise.all(URLs.map(fetchData));
      }

      const movieResult = await getAllData(promiseUrls)
        .then((response) => {
          return response;
        });

      await this.db.push(DATABASE_DAUM, movieResult);

      return movieResult;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('daum scraping fail!');
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async scrapingMovieFromNaver(): Promise<Movie[]> {
    let crawledMovie: Movie[] = [];

    this.logger.debug('naver movie: start scraping');

    try {
      await axios.get(TARGET_URL_NAVER).then((response) => {
        const $ = cheerio.load(response.data);
        const $movieList = $('div.lst_wrap ul.lst_detail_t1').children('li');
        $movieList.each(function(i) {
          const summary = $(this).find('dd dl.info_txt1').text()
            .replace(/\t/gi, '').replace(/\n/gi, '');
          const openDate = summary.match(/\d{4}.\d{2}.\d{2}/)?.toString();
          const runningTime = summary.match(/(?<=\|)(.*?)(?=분\|)/g)?.toString();
          const director = summary.match(/(?<=감독).*?(?=출연)/)?.toString().split(', ');
          const actor = summary.match(/(?<=출연).*/)?.toString().split(', ');

          crawledMovie[i] = {
            id: i,
            name: $(this).find('dt.tit a').text(),
            runningTime: runningTime ? Number(runningTime) : 0,
            openDate: openDate ? new Date(openDate) : new Date(),
            director: director ? director : [],
            actor: actor ? actor : [],
          };
        });
      });

      const result = crawledMovie.filter(m => m.name);

      await this.db.push(DATABASE_NAVER, result);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('naver scraping fail!');
    }

  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async scrapingMovieFromCGV() {
    const movieIndex: any[] = [];

    this.logger.debug('cgv movie: start scraping');

    try {
      await axios.get(TARGET_URL_CGV).then((response) => {
        const $ = cheerio.load(response.data);
        const $movieChart = $('div.sect-movie-chart ol').children('li');

        $movieChart.each(function(i) {
          movieIndex[i] =
            $(this).find('div.box-contents a[href*="/movies/"]')
              .attr('href')?.toString().replace('/movies/detail-view/?midx=', '');
        });
      });

      const uniqueMovieIndex = movieIndex.filter((value => value != null));

      const promiseUrls = uniqueMovieIndex.map((idx) => {
        return `${TARGET_URL_CGV_SECOND}${idx}`;
      });

      function fetchData(URL: string) {
        return axios.get(URL)
          .then(function(response) {
            const $ = cheerio.load(response.data);
            const $contents = $('div.sect-base-movie div.box-contents div.spec dl');
            return {
              id: Number($('#menu div.col-detail ul li.on a').attr('href')?.match(/(?<=midx=).*?(?=#menu)/)),
              name: $('div.sect-base-movie div.box-contents div.title strong').text(),
              director: $contents.find('dd:nth-child(2) a').text(),
              actor: $contents.find('dd.on').first().text()
                .replace(/\t/gi, '').replace(/\n/gi, '')
                .replace(/ /gi, '').split(', '),
              runningTime: Number($contents.find('dd').text()
                .match(/(?<=, ).*?(?=분, )/gi)?.toString()),
              openDate: $contents.text().replace(/\t/gi, '').replace(/\n/gi, '')
                .replace(/ /gi, '').match(/\d{4}.\d{2}.\d{2}/)?.toString(),
            };
          });
      }

      function getAllData(URLs: string[]) {
        return Promise.all(URLs.map(fetchData));
      }

      const movieResult = await getAllData(promiseUrls)
        .then((response) => {
          return response;
        });

      await this.db.push(DATABASE_CGV, movieResult);

      return movieResult;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('cgv scraping fail!');
    }
  }
}
