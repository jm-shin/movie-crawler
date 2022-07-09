export interface ScrapInterface{
    readonly index: number,
    readonly title: string,
    readonly runningTime: number,
    readonly openDate?: Date | null,
    readonly director?: string[],
    readonly actor?: string[],
}