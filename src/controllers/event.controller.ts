import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateEventDto } from 'src/dto/event/create-event.dto';
import { UpdateEventDto } from 'src/dto/event/update-event.dto';
import { Event } from 'src/entities/event.entity';
import { EventService } from 'src/services/event.service';
import { UpdateResult } from 'typeorm';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {};

  @Post('create')
  create(@Body() createEventDto: CreateEventDto): Event {
    return this.eventService.create(createEventDto);
  }

  @Get(':id')
  read(@Param('id') id: string) {
    return this.eventService.read(id);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<UpdateResult>  {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventService.delete(id);
  }
}
