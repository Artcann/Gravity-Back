import { Injectable } from "@nestjs/common";
import { CreateMemberDto } from "src/dto/member/create-member.dto";
import { Member } from "src/entities/member.entity";

@Injectable()
export class MemberService {
    
    create(createMemberDto: CreateMemberDto, filePath: string): Member {
        return Member.create(createMemberDto);
    }

}