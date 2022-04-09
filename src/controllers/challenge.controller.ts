import { Body, Controller, Delete, ForbiddenException, Get, HttpException, Param, Post, Req, Request, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Roles } from "src/decorators/roles.decorator";
import { CreateChallengeDto } from "src/dto/challenge/create-challenge.dto";
import { CreateSubmissionDto } from "src/dto/challenge/create-submission.dto";
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
        return this.challengeService.getNewChallengesByType(req.user.userId, ChallengeTypeEnum.NORMAL, req.user.lang);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('new/specials')
    getNewSpecialChallenges(@Request() req) {
        return this.challengeService.getNewChallengesByType(req.user.userId, ChallengeTypeEnum.SPECIAL, req.user.lang);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('validated')
    getValidatedChallenges(@Request() req) {
        return this.challengeService.getChallengesByStatus(req.user.userId, ChallengeStatusEnum.VALIDATED, req.user.lang);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('processing')
    getProcessingChallenges(@Request() req) {
        return this.challengeService.getChallengesByStatus(req.user.userId, ChallengeStatusEnum.PROCESSING, req.user.lang);
    }

    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get('refused')
    getRefusedChallenges(@Request() req) {
        return this.challengeService.getChallengesByStatus(req.user.userId, ChallengeStatusEnum.REFUSED, req.user.lang);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get('admin/all')
    getAllChallenges() {
        return this.challengeService.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Get(':id')
    getChallengeById(@Request() req, @Param('id') id: string) {
        return this.challengeService.getChallengeById(id, req.user.userId, req.user.lang);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Post('create')
    createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
        return this.challengeService.create(createChallengeDto);
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
    upload(@UploadedFile() image: Express.Multer.File, @Request() req, @Param('id') id: string, @Body() body: any) {
        return this.challengeService.updateSubmission(req.user.userId, id, image.filename, body.status);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Delete(':id/submission')
    async deleteSubmission(@Request() req, @Param('id') id: string) {
        if(await this.challengeService.challengeOwnedByUser(req.user.userId, id)) {
            this.challengeService.deleteSubmission(id);
            const challenges = await this.challengeService.getChallengeByUser(req.user.userId, req.user.lang);
            console.log(challenges);
            if (challenges.length === 0) {
                this.challengeService.deleteSubmissionStatus(req.user.userId, id);
            }
        } else {
            throw new UnauthorizedException();
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Delete('admin/:id/submission')
    deleteSubmissionAdmin(@Param('id') id: string) {
        return this.challengeService.deleteSubmission(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ListMember)
    @Get('submission/:id/shareStatus')
    changeShareStatus(@Param('id') id: string) {
        return this.challengeService.changeShareStatus(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Post('submission')
    async submitChallengeAnswer(@Body() createSubmissionDto: CreateSubmissionDto, @Request() req) {
        if (await this.challengeService.isChallengeClosed(createSubmissionDto.challengeId)) {
            throw new ForbiddenException({
                message: "This event is closed"
            })
        }
        return this.challengeService.submitChallengeAnswer(createSubmissionDto, req.user.userId);
    }
}