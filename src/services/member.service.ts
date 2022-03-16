import { Injectable } from "@nestjs/common";
import { CreateMemberDto } from "src/dto/member/create-member.dto";
import { UpdateMemberDto } from "src/dto/member/update-member.dto";
import { Member } from "src/entities/member.entity";
import { UpdateResult } from "typeorm";

@Injectable()
export class MemberService {
        
    create(createMemberDto: CreateMemberDto, filePath: string): Member {
        const member = Member.create({...createMemberDto, image: filePath});

        member.save();
        
        return member;
    }

    read(id: string) {
        return Member.findOne(id);
    }

    update(id: string, updateMemberDto: UpdateMemberDto, filePath: string): Promise<UpdateResult> {
        return Member.update(id, {...updateMemberDto, image: filePath});
    }

    delete(id: string) {
        Member.delete(id);
    }

}