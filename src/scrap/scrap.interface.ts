export interface ScrapInterface{
    readonly id: number,
    readonly name: string,
    readonly runningTime: number,
    readonly openDate?: Date | null,
    readonly director?: string[],
    readonly actor?: string[],
}