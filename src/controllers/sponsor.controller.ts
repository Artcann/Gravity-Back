import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ideahub } from "googleapis/build/src/apis/ideahub";
import { diskStorage } from "multer";
import { Roles } from "src/decorators/roles.decorator";
import { CreateSponsorDto } from "src/dto/sponsor/create-sponsor.dto";
import { UpdateSponsorDto } from "src/dto/sponsor/update-sponsor.dto";
import { RoleEnum } from "src/entities/enums/role.enum";
import { Role } from "src/entities/role.entity";
import { QuaranteMilleEuros } from "src/entities/sponsor.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { SponsorService } from "src/services/sponsor.service";

@Controller('sponsor')
export class SponsorController {
    constructor(private sponsorService: SponsorService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Post('create')
    create(@Body() createSponsorDto: CreateSponsorDto): QuaranteMilleEuros {
        return this.sponsorService.create(createSponsorDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('all')
    getClassicSponsor() {
        return this.sponsorService.getClassicSponsors();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('/food/all')
    getFoodSponsors() {
        return this.sponsorService.getFoodSponsors()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get(':id')
    read(@Param('id') id: string) {
        return this.sponsorService.read(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Post('update/:id')
    update(@Param(':id') id: string, updateSponsorDto: UpdateSponsorDto) {
        return this.sponsorService.update(id, updateSponsorDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.sponsorService.delete(id);
    }

}