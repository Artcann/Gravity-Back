import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Roles } from "src/decorators/roles.decorator";
import { CreateMemberDto } from "src/dto/member/create-member.dto";
import { UpdateMemberDto } from "src/dto/member/update-member.dto";
import { RoleEnum } from "src/entities/enums/role.enum";
import { Member } from "src/entities/member.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { MemberService } from "src/services/member.service";
import { UpdateResult } from "typeorm";

@Controller('member')
export class MemberController {

    constructor(private memberService: MemberService) {};

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Post('create')
    create(@Body() createMemberDto: CreateMemberDto): Member {
        return this.memberService.create(createMemberDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get('admin/all')
    getAll() {
        return this.memberService.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.User)
    @Get(':id')
    read(@Param('id') id: string) {
        return this.memberService.read(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Post('update/:id')
    update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto): Promise<UpdateResult> {
        return this.memberService.update(id, updateMemberDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Delete('id')
    delete(@Param('id') id: string) {
        return this.memberService.delete(id);
    }
}