import { Injectable } from "@nestjs/common";
import { CreateMemberDto } from "src/dto/member/create-member.dto";
import { UpdateMemberDto } from "src/dto/member/update-member.dto";
import { Member } from "src/entities/member.entity";
import { UpdateResult } from "typeorm";

@Injectable()
export class MemberService {
        
    create(createMemberDto: CreateMemberDto): Member {
        const member = Member.create(createMemberDto);

        member.save();
        
        return member;
    }

    read(id: string) {
        return Member.findOne(id);
    }

    getAll() {
        return Member.find();
    }

    update(id: string, updateMemberDto: UpdateMemberDto): Promise<UpdateResult> {
        return Member.update(id, updateMemberDto);
    }

    delete(id: string) {
        Member.delete(id);
    }

}