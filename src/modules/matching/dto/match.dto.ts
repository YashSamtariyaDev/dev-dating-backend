export class MatchDto {
  id: number;
  matchedAt: string;
  user: {
    id: number;
    name: string;
  };
}

export class SwipeResponseDto {
  message?: string;
  match?: MatchDto;
}
