interface MovieSummary {
    readonly name: string;
    readonly runningTime: number;
    readonly openDate: Date;
}

interface MovieDetail {
    director: string[],
    actor: string[],
}

export type {MovieSummary, MovieDetail};