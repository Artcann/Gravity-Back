import { Injectable } from "@nestjs/common";
import { Division } from "src/entities/division.entity";
import { DivisionLabelEnum } from "src/entities/enums/division-label.enum";

@Injectable()
export class DivisionService {

    getDivisonByLabel(label: DivisionLabelEnum) {
        return Division.createQueryBuilder("division")
            .leftJoinAndSelect("division.members", "members")
            .orderBy("members.order")
            .where("division.divisionLabel = :label", {label: label})
            .getOne();
            
    }

    getAll() {
        return Division.find();
    }

}