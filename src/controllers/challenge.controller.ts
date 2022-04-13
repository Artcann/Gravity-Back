import { Body, Controller, Delete, ForbiddenException, Get, HttpException, Param, Post, Put, Req, Request, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { chat_v1 } from "googleapis";
import { diskStorage, memoryStorage } from "multer";
import { Roles } from "src/decorators/roles.decorator";
import { CreateChallengeDto } from "src/dto/challenge/create-challenge.dto";
import { CreatePointDto } from "src/dto/challenge/create-point.dto";
import { CreateSubmissionDto } from "src/dto/challenge/create-submission.dto";
import { UpdateStatusDto } from "src/dto/challenge/update-status.dto";
import { ChallengeStatusEnum } from "src/entities/enums/challenge-status.enum";
import { ChallengeTypeEnum } from "src/entities/enums/challenge-type.enum";
import { RoleEnum } from "src/entities/enums/role.enum";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { ChallengeService } from "src/services/challenge.service";

const sharp = require('sharp');

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
    @Roles(RoleEnum.VerifiedUser)
    @Get('ranking')
    getRanking() {
        return this.challengeService.getRanking();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get('admin/all')
    getAllChallenges() {
        return this.challengeService.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Post('status')
    updateStatus(@Body() updateStatusDto: UpdateStatusDto) {
        return this.challengeService.updateStatus(updateStatusDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get(':challenge/submission/:id')
    getSubmissionByUser(@Param('challenge') challengeId: string, @Param('id') userId: string) {
        return this.challengeService.getChallengeSubmissionByUser(userId, challengeId);
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
        storage: memoryStorage(),
    }))
    async upload(@UploadedFile() image: Express.Multer.File, @Request() req, @Param('id') id: string, @Body() body: any) {
        const filename = "image-" + Date.now() + "-" + Math.round(Math.random() * 1E9)  + ".webp";
        await sharp(image.buffer)
            .webp({quality: 50})
            .toFile("./ressources/images/" + filename)
    
        
        return this.challengeService.updateSubmission(req.user.userId, id, filename, body.status);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.VerifiedUser)
    @Delete(':id/submission')
    async deleteSubmission(@Request() req, @Param('id') id: string) {
        if(await this.challengeService.challengeOwnedByUser(req.user.userId, id)) {
            const challengeSubmission = await this.challengeService.getChallengeSubmissionById(id);
            await this.challengeService.deleteSubmission(id);
            const challenges = await this.challengeService.getChallengeSubmissionByUser(req.user.userId, challengeSubmission.challenge.id.toString());
            if (challenges.length === 0) {
                this.challengeService.deleteSubmissionStatus(req.user.userId, challengeSubmission.challenge.id.toString());
            }
        } else {
            throw new UnauthorizedException();
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Post('admin/add_points')
    addPoints(@Body() createPointDto: CreatePointDto) {
        return this.challengeService.createPoint(createPointDto);
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
    @Roles(RoleEnum.Admin)
    @Get('list-user/processing/:id')
    listUserProcessing(@Param('id') challengeId: string) {
        return this.challengeService.getUserByChallengeByStatus(challengeId, ChallengeStatusEnum.PROCESSING);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get('list-user/validated/:id')
    listUserAccepted(@Param('id') challengeId: string) {
        return this.challengeService.getUserByChallengeByStatus(challengeId, ChallengeStatusEnum.VALIDATED);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.Admin)
    @Get('list-user/refused/:id')
    listUserRefused(@Param('id') challengeId: string) {
        return this.challengeService.getUserByChallengeByStatus(challengeId, ChallengeStatusEnum.REFUSED);
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