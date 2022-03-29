import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationActionEnum } from "./enums/notification-action.enum";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({default: true})
    isNew: boolean;

    @Column({nullable: true})
    title: string;

    @Column({nullable: true})
    action: NotificationActionEnum;

    @Column()
    url: string;

    @ManyToOne(() => User, user => user.notifications)
    user: User;

}