import {Module} from '@nestjs/common';
import {ScrapService} from './scrap.service';
import {DatabaseModule} from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [DatabaseModule, ScrapService],
    exports:[ScrapService]
})
export class ScrapModule {
}
