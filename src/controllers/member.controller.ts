import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Roles } from "src/decorators/roles.decorator";
import { CreateMemberDto } from "src/dto/member/create-member.dto";
import { UpdateMemberDto } from "src/dto/member/update-member.dto";
import { RoleEnum } from "src/entities/enums/role.enum";
import { Member } from "src/entities/member.entity";
import { MemberService } from "src/services/member.service";
import { UpdateResult } from "typeorm";

@Controller('member')
export class MemberController {

    constructor(private memberService: MemberService) {};

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
    create(@Body() createMemberDto: CreateMemberDto, @UploadedFile() image: Express.Multer.File): Member {
        return this.memberService.create(createMemberDto, image ? image.filename : null);
    }

    @Roles(RoleEnum.User)
    @Get(':id')
    read(@Param('id') id: string) {
        return this.memberService.read(id);
    }

    @Roles(RoleEnum.ListMember)
    @Post('update/:id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './ressources/images/',
            filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
            }
        })
    }))
    update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto,
    @UploadedFile() image: Express.Multer.File): Promise<UpdateResult> {
        return this.memberService.update(id, updateMemberDto, image ? image.filename : null);
    }

    @Roles(RoleEnum.ListMember)
    @Delete('id')
    delete(@Param('id') id: string) {
        return this.memberService.delete(id);
    }
}