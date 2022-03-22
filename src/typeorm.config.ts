import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { EventTranslation } from './entities/event-translation.entity';
import { SponsorTranslation } from './entities/sponsor-translation.entity';
import { QuaranteMilleEuros } from './entities/sponsor.entity';
import { Member } from './entities/member.entity';
import { MemberTranslation } from './entities/member-translation.enum';
import { Presentation } from './entities/presentation.entity';
import { Role } from "./entities/role.entity";

const typeOrmConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'friendly_meme',
    entities: [User, Token, Event, EventTranslation, Member, MemberTranslation,
    QuaranteMilleEuros, SponsorTranslation, Presentation, Role],
    synchronize: true,
    autoLoadEntities: true,
}

export = typeOrmConfig;