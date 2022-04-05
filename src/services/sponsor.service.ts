import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Point } from "geojson";
import { CreateSponsorDto } from "src/dto/sponsor/create-sponsor.dto";
import { UpdateSponsorDto } from "src/dto/sponsor/update-sponsor.dto";
import { LanguageEnum } from "src/entities/enums/language.enum";
import { SponsorTypeEnum } from "src/entities/enums/sponsor-type.enum";
import { QuaranteMilleEuros } from "src/entities/sponsor.entity";

@Injectable()
export class SponsorService {
    
    create(createSponsorDto: CreateSponsorDto) {

        const location: Point = {
            type: "Point",
            coordinates: [createSponsorDto.longitude, createSponsorDto.latitude]
        }

        const sponsor = QuaranteMilleEuros.create({...createSponsorDto, location: location});
        sponsor.save();

        return sponsor;
    }

    read(id: string, lang: LanguageEnum) {
        return QuaranteMilleEuros.createQueryBuilder("sponsor")
            .leftJoinAndSelect("sponsor.translation", "translation", 
            "translation.language = :language", {language: lang})
            .where("sponsor.id = :id", {id: id})
            .getOne();
    }

    getSponsorByType(type: SponsorTypeEnum, lang: LanguageEnum) {
        return QuaranteMilleEuros.createQueryBuilder("sponsor")
            .leftJoinAndSelect("sponsor.translation", "translation", 
            "translation.language = :language", {language: lang})
            .where("sponsor.type = :type", {type: type})
            .getMany();
    }

    update(id: string, updateSponsorDto: UpdateSponsorDto) {

        if(updateSponsorDto.latitude && updateSponsorDto.longitude) {
            const location: Point = {
                type: "Point",
                coordinates: [updateSponsorDto.longitude, updateSponsorDto.latitude]
            }

            return QuaranteMilleEuros.update(id, {...updateSponsorDto, location: location});
        } else {
            return QuaranteMilleEuros.update(id, updateSponsorDto);
        }
        

        
    }

    delete(id: string) {
        if(QuaranteMilleEuros.findOne(id)) {
            return QuaranteMilleEuros.delete(id);
        } else {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Sponsor not found in the database. Check the id you provided."
            })
        }
    }
}