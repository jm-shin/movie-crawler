interface Movie extends MovieSummary, MovieDetail {
}

interface MovieSummary {
    readonly id: number,
    readonly name: string;
    readonly runningTime: number;
    readonly openDate: Date;
}

interface MovieDetail {
    readonly director: string[],
    readonly actor: string[],
}

interface DaumMovieSummary {
    readonly id: number;
    readonly titleKorean: string;
    readonly countryMovieInformation: { duration: number; releaseDate: string; };
}

export type {Movie, MovieSummary, MovieDetail, DaumMovieSummary};