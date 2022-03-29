import { IsEnum } from "class-validator";
import { DivisionLabelEnum } from "src/entities/enums/division-label.enum";

export class GetDivisionByLabelDto {
    @IsEnum(DivisionLabelEnum)
    label: DivisionLabelEnum;
}