import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Point } from "geojson";
import { CreateEventDto } from "src/dto/event/create-event.dto";
import { UpdateEventDto } from "src/dto/event/update-event.dto";
import { Event } from "src/entities/event.entity";
import { UpdateResult } from "typeorm";

@Injectable()
export class EventService {

  create(createEventDto: CreateEventDto, filePath: string) {

    const location: Point = {
      type: "Point",
      coordinates: [createEventDto.longitude, createEventDto.latitude]
    }

    const event = Event.create({...createEventDto, image: filePath, location: location});

    event.save();

    return event;
  }

  read(id: string) {
    return Event.findOne(id);
  }

  update(id: string, updateEventDto: UpdateEventDto){
    return Event.update(id, updateEventDto);
  }

  delete(id: string) {
    if(Event.findOne(id)) {
      return Event.delete(id);
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: "Event not found in database. Check if the id you entered is correct"
      })
    }
  }
}