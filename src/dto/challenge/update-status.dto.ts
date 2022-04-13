import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ChallengeStatusEnum } from 'src/entities/enums/challenge-status.enum';
export class UpdateStatusDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  challengeId: number;

  @IsEnum(ChallengeStatusEnum)
  status: ChallengeStatusEnum;

  @IsOptional()
  @IsString()
  context: string;
}