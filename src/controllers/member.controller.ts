import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { CreateMemberDto } from "src/dto/member/create-member.dto";
import { Member } from "src/entities/member.entity";
import { MemberService } from "src/services/member.service";

@Controller('member')
export class MemberController {

    constructor(private memberService: MemberService) {};

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
}