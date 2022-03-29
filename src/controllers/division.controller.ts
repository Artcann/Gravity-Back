import { Body, Controller, Get, Param } from "@nestjs/common";
import { GetDivisionByLabelDto } from "src/dto/division/get-by-label.dto";
import { DivisionService } from "src/services/division.service";

@Controller('division')
export class DivisionController {
    constructor(private divisionService: DivisionService) {}

    @Get('/label')
    getDivisionByLabel(@Body() getDivisionByLabelDto: GetDivisionByLabelDto) {
        return this.divisionService.getDivisonByLabel(getDivisionByLabelDto.label);
    }
}