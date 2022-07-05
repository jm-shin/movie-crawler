import { DATABASE_CONNECTION } from "./database.constants";
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

export const databaseConnectionProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: () => {
      const db = new JsonDB(new Config("localDataBase", true, false, '/'));
      return db;
    },
    inject:[],
  }
];