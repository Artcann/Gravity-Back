import { Body, Controller, Delete, Get, Param, Post, Request, RequestMapping, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ideahub } from "googleapis/build/src/apis/ideahub";
import { diskStorage } from "multer";
import { Roles } from "src/decorators/roles.decorator";
import { CreateSponsorDto } from "src/dto/sponsor/create-sponsor.dto";
import { UpdateSponsorDto } from "src/dto/sponsor/update-sponsor.dto";
import { RoleEnum } from "src/entities/enums/role.enum";
import { SponsorTypeEnum } from "src/entities/enums/sponsor-type.enum";
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
    getClassicSponsor(@Request() req) {
        return this.sponsorService.getSponsorByType(SponsorTypeEnum.CLASSIC, req.user.lang);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('/food/all')
    getFoodSponsors(@Request() req) {
        return this.sponsorService.getSponsorByType(SponsorTypeEnum.FOOD, req.user.lang);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get('admin/all')
    getAllSponsor() {
        return this.sponsorService.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get(':id')
    read(@Param('id') id: string, @Request() req) {
        return this.sponsorService.read(id, req.user.lang);
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