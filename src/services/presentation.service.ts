import { Injectable } from "@nestjs/common";
import { CreatePresentationDto } from "src/dto/presentation/create-presentation.dto";
import { UpdatePresentationDto } from "src/dto/presentation/update-presentation.dto";
import { Presentation } from "src/entities/presentation.entity";

@Injectable()
export class PresentationService {

    create(createPresentationDto: CreatePresentationDto) {
        const presentation = Presentation.create(createPresentationDto);

        presentation.save();

        return presentation;
    }

    getAll() {
        return Presentation.find();
    }

    read(id: string) {
        return Presentation.findOne(id);
    }

    update(id: string, updatePresentationDto: UpdatePresentationDto) {
        console.log(id);
        return Presentation.update(id, updatePresentationDto);
    }

    delete(id: string) {
        Presentation.delete(id);
    }

    async getStatus(id: string) {
        const presentation = await Presentation.findOne(id);

        return presentation.status;
    }
}