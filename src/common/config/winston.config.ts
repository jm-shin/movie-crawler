import {utilities as nestWinstonModuleUtilities} from "nest-winston/dist/winston.utilities";
import * as winston from 'winston';

export const transports = {
    format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('web-scraper'),
    ),
    transports: [
        new winston.transports.Console(),
        new (require('winston-daily-rotate-file'))({
            level: process.env.LEVEL === 'production' ? 'info' : 'debug',
            dirname: './logs',
            filename: '%DATE%.log',
            datePattern: 'YYMMDD',
            prettyPrint: true,
            maxSize: '10m',
            maxFiles: '30d',
            showLevel: true,
            createSymlink: true,
            symlinkName: 'MAIN.log',
        }),
    ],
};