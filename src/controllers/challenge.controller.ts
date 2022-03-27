import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { Roles } from "src/decorators/roles.decorator";
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
        return this.challengeService.getNewChallengesByType(req.user.userId, ChallengeTypeEnum.NORMAL);
    }

}