import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreatePointDto {
  @IsString()
  userId: string

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  challengeId: string;

  @IsOptional()
  @IsString()
  context: string;
}