import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Point } from "geojson";
import { CreateSponsorDto } from "src/dto/sponsor/create-sponsor.dto";
import { UpdateSponsorDto } from "src/dto/sponsor/update-sponsor.dto";
import { QuaranteMilleEuros } from "src/entities/sponsor.entity";

@Injectable()
export class SponsorService {
    
    create(createSponsorDto: CreateSponsorDto, filePath: string) {

        const location: Point = {
            type: "Point",
            coordinates: [createSponsorDto.longitude, createSponsorDto.latitude]
        }

        const sponsor = QuaranteMilleEuros.create({...createSponsorDto, picture: filePath, location: location});
        sponsor.save();

        return sponsor;
    }

    read(id: string) {
        return QuaranteMilleEuros.findOne(id);
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