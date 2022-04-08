import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NotificationActionEnum } from "./enums/notification-action.enum";
import { NotificationStatus } from "./notification-status.entity";

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({nullable: true})
    title: string;

    @Column({nullable: true})
    action: NotificationActionEnum;

    @Column({nullable: true})
    url: string;

    @OneToMany(() => NotificationStatus, notificationStatus => notificationStatus.notification, {eager: true})
    notification_status: NotificationStatus[];



}