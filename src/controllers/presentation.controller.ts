import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Roles } from "src/decorators/roles.decorator";
import { CreatePresentationDto } from "src/dto/presentation/create-presentation.dto";
import { UpdatePresentationDto } from "src/dto/presentation/update-presentation.dto";
import { RoleEnum } from "src/entities/enums/role.enum";
import { Presentation } from "src/entities/presentation.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { PresentationService } from "src/services/presentation.service";

@Controller('presentation')
export class PresentationController {
    constructor(private presentationService: PresentationService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Post('create')
    create(@Body() createPresentationDto: CreatePresentationDto): Presentation {
        return this.presentationService.create(createPresentationDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('status/:id')
    getStatus(@Param('id') id: string) {
        return this.presentationService.getStatus(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get('admin/all')
    getAll() {
        return this.presentationService.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get(':id')
    read(@Param('id') id: string) {
        return this.presentationService.read(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Put('update/:id')
    update(@Param(':id') id: string, @Body() updatePresentationDto: UpdatePresentationDto) {
        return this.presentationService.update(id, updatePresentationDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.presentationService.delete(id);
    }
}