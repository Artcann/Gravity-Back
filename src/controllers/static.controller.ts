import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { StaticService } from 'src/services/static.service';

@Controller('static')
export class StaticController {

  constructor(private staticService: StaticService) {}

  @Roles(RoleEnum.User)
  @Get("image/:path")
  @Header('Content-Type', 'image/jpeg')
  public async getImage(@Param('path') path: string, @Res() res: Response){
    const stream = await this.staticService.getImage(path);
    stream.pipe(res);
  }
}
