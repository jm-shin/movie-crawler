interface Movie {
    readonly name: string;
    readonly runningTime: number;
    readonly openDate: Date;
    director: string[],
    actor: string[],
}

interface MovieSummary {
    readonly name: string;
    readonly runningTime: number;
    readonly openDate: Date;
}

interface MovieDetail {
    director: string[],
    actor: string[],
}

interface DaumMovieSummary {
    id: number;
    titleKorean: string;
    countryMovieInformation: { duration: number; releaseDate: string; };
}

export type {Movie, MovieSummary, MovieDetail, DaumMovieSummary};