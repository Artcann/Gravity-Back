import { Controller, Get, Header, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage, memoryStorage } from 'multer';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { Role } from 'src/entities/role.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { StaticService } from 'src/services/static.service';

const sharp = require('sharp');

@Controller('static')
export class StaticController {

  constructor(private staticService: StaticService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Get("image/:path")
  @Header('Content-Type', 'image/jpeg')
  public async getImage(@Param('path') path: string, @Res() res: Response){
    const stream = await this.staticService.getImage(path);
    stream.on("error", (error: any) => {console.log("Caught", error);});
    stream.pipe(res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
      storage: memoryStorage(),
      }))
  async upload(@UploadedFile() image: Express.Multer.File) {
    const filename = "image-" + Date.now() + "-" + Math.round(Math.random() * 1E9)  + ".webp";
    await sharp(image.buffer)
      .webp({quality: 50})
      .toFile("./ressources/images/" + filename)

        
    return { filename: filename};
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.VerifiedUser)
  @Post('update')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
        destination: './ressources/images/',
        filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
        }
    })
}))
  update(@UploadedFile() image: Express.Multer.File, oldUri: string) {
    this.staticService.deleteImage(oldUri);
    return {filename: image.filename};
  }
}
