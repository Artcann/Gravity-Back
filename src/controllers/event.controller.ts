import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateEventDto } from 'src/dto/event/create-event.dto';
import { UpdateEventDto } from 'src/dto/event/update-event.dto';
import { Event } from 'src/entities/event.entity';
import { EventService } from 'src/services/event.service';
import { UpdateResult } from 'typeorm';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {};

  @Post('create')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './ressources/images/',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
      }
    })
  }))
  create(@Body() createEventDto: CreateEventDto, @UploadedFile() image: Express.Multer.File): Event {
    return this.eventService.create(createEventDto, image ? image.filename : null);
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
