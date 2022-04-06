import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { ChallengeTranslation } from 'src/entities/challenge-translation.entity';
import { ChallengeSubmissionTypeEnum } from 'src/entities/enums/challenge-submission-type.enum';
import { ChallengeTypeEnum } from 'src/entities/enums/challenge-type.enum';
import { ChallengeTranslationDto } from './challenge-translation.dto';

export class CreateChallengeDto {
    @IsDateString()
    expiredAt: Date;

    @IsEnum(ChallengeTypeEnum)
    type: ChallengeTypeEnum;

    @IsEnum(ChallengeSubmissionTypeEnum)
    submissionType: ChallengeSubmissionTypeEnum;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ChallengeTranslationDto)
    translation: ChallengeTranslationDto[];
}
