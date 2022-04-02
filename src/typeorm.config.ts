import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { EventTranslation } from './entities/event-translation.entity';
import { SponsorTranslation } from './entities/sponsor-translation.entity';
import { QuaranteMilleEuros } from './entities/sponsor.entity';
import { Member } from './entities/member.entity';
import { MemberTranslation } from './entities/member-translation.entity';
import { Presentation } from './entities/presentation.entity';
import { Role } from "./entities/role.entity";
import { SocialNetwork } from "./entities/social-network.entity";
import { Notification } from "./entities/notification.entity";
import { Group } from "./entities/group.entity";
import { Challenge } from "./entities/challenge.entity";
import { ChallengeTranslation } from "./entities/challenge-translation.entity";
import { ChallengeSubmission } from "./entities/challenge-submission.entity";
import { ChallengeStatus } from "./entities/challenge-status.entity";
import { Division } from "./entities/division.entity";
import { Chat } from "./entities/chat.entity";

const typeOrmConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'friendly_meme',
    entities: [User, Token, Event, EventTranslation, Member, MemberTranslation,
    QuaranteMilleEuros, SponsorTranslation, Presentation, Role, SocialNetwork, 
    Notification, Group, Challenge, ChallengeSubmission, ChallengeTranslation, 
    ChallengeStatus, Division, Chat],
    synchronize: true,
    autoLoadEntities: true
}

export = typeOrmConfig;