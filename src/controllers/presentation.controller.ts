import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Roles } from "src/decorators/roles.decorator";
import { CreatePresentationDto } from "src/dto/presentation/create-presentation.dto";
import { RoleEnum } from "src/entities/enums/role.enum";
import { Presentation } from "src/entities/presentation.entity";
import { PresentationService } from "src/services/presentation.service";

@Controller('presentation')
export class PresentationController {
    constructor(private presentationService: PresentationService) {}

    @Roles(RoleEnum.ListMember)
    @Post('create')
    create(@Body() createPresentationDto: CreatePresentationDto): Presentation {
        return this.presentationService.create(createPresentationDto);
    }

    @Roles(RoleEnum.VerifiedUser)
    @Get(':id')
    read(@Param('id') id: string) {
        return this.presentationService.read(id);
    }

    @Roles(RoleEnum.ListMember)
    @Post('update/:id')
    update(@Param(':id') id: string, updatePresentationDto) {
        return this.presentationService.update(id, updatePresentationDto);
    }

    @Roles(RoleEnum.ListMember)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.presentationService.delete(id);
    }
}