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

const typeOrmConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres-db',
    port: +process.env.POSTGRES_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'friendly_meme',
    entities: [User, Token, Event, EventTranslation, Member, MemberTranslation,
    QuaranteMilleEuros, SponsorTranslation, Presentation],
    synchronize: true,
    autoLoadEntities: true,
}

export = typeOrmConfig;