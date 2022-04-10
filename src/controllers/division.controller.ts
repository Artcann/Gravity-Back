import { RoleEnum } from 'src/entities/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { GetDivisionByLabelDto } from "src/dto/division/get-by-label.dto";
import { DivisionService } from "src/services/division.service";
import { Roles } from 'src/decorators/roles.decorator';

@Controller('division')
export class DivisionController {
    constructor(private divisionService: DivisionService) {}

    @Post('label')
    getDivisionByLabel(@Body() getDivisionByLabelDto: GetDivisionByLabelDto) {
        return this.divisionService.getDivisonByLabel(getDivisionByLabelDto.label);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get('admin/all')
    getAll() {
        return this.divisionService.getAll();
    }
}