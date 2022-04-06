import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateEventDto } from 'src/dto/event/create-event.dto';
import { UpdateEventDto } from 'src/dto/event/update-event.dto';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { Event } from 'src/entities/event.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { EventService } from 'src/services/event.service';
import { UpdateResult } from 'typeorm';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {};

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ListMember)
  @Post('create')
  create(@Body() createEventDto: CreateEventDto): Event {
    return this.eventService.create(createEventDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @Get('admin/all')
  getAllEventAdmin() {
    return this.eventService.getAllEvent();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('all')
  getAllEvent(@Request() req): Promise<Event[]> {
    return this.eventService.getAllEventByLang(req.user.lang);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('open')
  getOpenEvent(@Request() req): Promise<Event[]> {
    return this.eventService.getOpenEvent(req.user.lang);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get('inscription/:id')
  inscription(@Param('id') id: string, @Request() req) {
    return this.eventService.inscription(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get(':id')
  async read(@Param('id') id: string, @Request() req) {
    const event = await this.eventService.read(id);
    let isUserRegistered = false;
    if(event.registered_user.some(user => user.id === req.user.userId)) {
      isUserRegistered = true;
    }
    return {...event, isUserRegistered: isUserRegistered};
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ListMember)
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<UpdateResult>  {
    return this.eventService.update(id, updateEventDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ListMember)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if(!(await Event.findOne(id))){
      throw new NotFoundException({
        message: "Cet évenement n'existe pas dans la base"
      })
    }
    return this.eventService.delete(id);
  }
}
