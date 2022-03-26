import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Point } from "geojson";
import { CreateSponsorDto } from "src/dto/sponsor/create-sponsor.dto";
import { UpdateSponsorDto } from "src/dto/sponsor/update-sponsor.dto";
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

    read(id: string) {
        return QuaranteMilleEuros.findOne(id);
    }

    getClassicSponsors() {
        return QuaranteMilleEuros.find({
            where: {
                type: SponsorTypeEnum.CLASSIC
            }
        });
    }

    getFoodSponsors() {
        return QuaranteMilleEuros.find({
            where: {
                type: SponsorTypeEnum.FOOD
            }
        })
    }

    update(id: string, updateSponsorDto: UpdateSponsorDto) {
        const location: Point = {
            type: "Point",
            coordinates: [updateSponsorDto.longitude, updateSponsorDto.latitude]
        }

        return QuaranteMilleEuros.update(id, {...updateSponsorDto, location: location});
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