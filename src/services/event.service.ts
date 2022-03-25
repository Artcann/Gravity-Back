import { BadRequestException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Point } from "geojson";
import { CreateEventDto } from "src/dto/event/create-event.dto";
import { UpdateEventDto } from "src/dto/event/update-event.dto";
import { LanguageEnum } from "src/entities/enums/language.enum";
import { Event } from "src/entities/event.entity";
import { User } from "src/entities/user.entity";

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

  getOpenEvent(language: string): Promise<Event[]>{
    return Event.createQueryBuilder('event')
      .innerJoinAndSelect('event.translation', 'translation')
      .where("translation.language = :language AND open = true", {language})
      .getMany();
  }

  getAllEvent(language: string): Promise<Event[]> {
    return Event.createQueryBuilder('event')
      .innerJoinAndSelect('event.translation', 'translation')
      .where("translation.language = :language", {language})
      .getMany();
  }

  async inscription(eventId: string, userId: string) {
    const event = await Event.findOne(eventId);
    const user = await User.findOne(userId);

    if(!event.open) {
      throw new BadRequestException({
        message: "The event you're trying to access is closed"
      })
    }

    if(!event.registered_user) {
      event.registered_user = [user];
    } else if(event.registered_user.some(registredUser => registredUser.id === user.id)) {
      delete event.registered_user[event.registered_user.findIndex(registredUser => registredUser.id === user.id )];
    } else {
      event.registered_user = [...event.registered_user, user];
    }

    event.save();

    return event.registered_user.some(registredUser => registredUser.id === user.id) 
    ? {"status": "subscribed"} 
    : {"status": "unsubscribed"};
  }
}