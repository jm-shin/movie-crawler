import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_CONNECTION } from "../database/database.constants";
import { JsonDB } from "node-json-db";

interface FooBar {
  Hello: string
  World: number
}

@Injectable()
export class ChartService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: JsonDB
  ) {}

  getChart() {
    const object = {Hello: "World", World: 5} as FooBar;
    this.db.push("/test", object);

    const result = this.db.getObject<FooBar>("/test");

    console.log(result);
    return result;
  }
}
