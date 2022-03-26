import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ideahub } from "googleapis/build/src/apis/ideahub";
import { diskStorage } from "multer";
import { Roles } from "src/decorators/roles.decorator";
import { CreateSponsorDto } from "src/dto/sponsor/create-sponsor.dto";
import { UpdateSponsorDto } from "src/dto/sponsor/update-sponsor.dto";
import { RoleEnum } from "src/entities/enums/role.enum";
import { Role } from "src/entities/role.entity";
import { QuaranteMilleEuros } from "src/entities/sponsor.entity";
import { SponsorService } from "src/services/sponsor.service";

@Controller('sponsor')
export class SponsorController {
    constructor(private sponsorService: SponsorService) {}

    @Roles(RoleEnum.ListMember)
    @Post('create')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './ressources/images/',
            filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
            }
        })
    }))
    create(@Body() createSponsorDto: CreateSponsorDto, @UploadedFile() image: Express.Multer.File): QuaranteMilleEuros {
        return this.sponsorService.create(createSponsorDto, image ? image.filename : null);
    }

    @Roles(RoleEnum.VerifiedUser)
    @Get('all')
    getClassicSponsor() {
        return this.sponsorService.getClassicSponsors();
    }

    @Roles(RoleEnum.VerifiedUser)
    @Get('/food/all')
    getFoodSponsors() {
        return this.sponsorService.getFoodSponsors()
    }

    @Roles(RoleEnum.VerifiedUser)
    @Get(':id')
    read(@Param('id') id: string) {
        return this.sponsorService.read(id);
    }

    @Roles(RoleEnum.ListMember)
    @Post('update/:id')
    update(@Param(':id') id: string, updateSponsorDto: UpdateSponsorDto) {
        return this.sponsorService.update(id, updateSponsorDto);
    }

    @Roles(RoleEnum.ListMember)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.sponsorService.delete(id);
    }

}