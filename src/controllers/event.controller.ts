import { Body, Controller, Delete, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateEventDto } from 'src/dto/event/create-event.dto';
import { UpdateEventDto } from 'src/dto/event/update-event.dto';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { Event } from 'src/entities/event.entity';
import { Role } from 'src/entities/role.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { EventService } from 'src/services/event.service';
import { UpdateResult } from 'typeorm';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {};

  @Roles(RoleEnum.ListMember)
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



  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('all')
  getAllEvent(@Request() req): Promise<Event[]> {
    return this.eventService.getAllEvent(req.user.lang);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('open')
  getOpenEvent(@Request() req): Promise<Event[]> {
    return this.eventService.getOpenEvent(req.user.lang);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('inscription/:id')
  inscription(@Param('id') id: string, @Request() req) {
    return this.eventService.inscription(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get(':id')
  read(@Param('id') id: string) {
    return this.eventService.read(id);
  }



  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ListMember)
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<UpdateResult>  {
    return this.eventService.update(id, updateEventDto);
  }



  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ListMember)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventService.delete(id);
  }


}
