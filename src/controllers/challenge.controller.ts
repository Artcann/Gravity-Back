import { Controller, Delete, Get, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Roles } from "src/decorators/roles.decorator";
import { ChallengeStatusEnum } from "src/entities/enums/challenge-status.enum";
import { ChallengeTypeEnum } from "src/entities/enums/challenge-type.enum";
import { RoleEnum } from "src/entities/enums/role.enum";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { ChallengeService } from "src/services/challenge.service";

@Controller('challenge')
export class ChallengeController {

    constructor(private challengeService: ChallengeService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('new/normals')
    getNewNormalChallenges(@Request() req) {
        return this.challengeService.getNewChallengesByType(req.user.userId, ChallengeTypeEnum.NORMAL);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('new/specials')
    getNewSpecialChallenges(@Request() req) {
        return this.challengeService.getNewChallengesByType(req.user.userId, ChallengeTypeEnum.SPECIAL);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('validated')
    getValidatedChallenges(@Request() req) {
        return this.challengeService.getChallengesByStatus(req.user.userId, ChallengeStatusEnum.VALIDATED);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('processing')
    getProcessingChallenges(@Request() req) {
        return this.challengeService.getChallengesByStatus(req.user.userId, ChallengeStatusEnum.PROCESSING);
    }

    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('refused')
    getRefusedChallenges(@Request() req) {
        return this.challengeService.getChallengesByStatus(req.user.userId, ChallengeStatusEnum.REFUSED);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get(':id')
    getChallengeById(@Param('id') id: string) {
        return this.challengeService.getChallengeById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Post(':id/image')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './ressources/images/',
            filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
            }
        })
    }))
    upload(@UploadedFile() image: Express.Multer.File, @Request() req, @Param('id') id: string) {
        return this.challengeService.updateSubmission(req.user.userId, id, image.filename);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Delete(':id/submission')
    deleteSubmission(@Request() req, @Param('id') id: string) {
        return this.challengeService.deleteSubmission(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Get('submission/:id/shareStatus')
    changeShareStatus(@Param('id') id: string) {
        return this.challengeService.changeShareStatus(id);
    }
}