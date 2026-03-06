export class MatchCreatedEvent {
  constructor(
    public readonly matchId: number,
    public readonly user1Id: number,
    public readonly user2Id: number,
  ) {}
}