import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Notification } from "./notification.entity";
import { User } from "./user.entity";

@Entity()
export class NotificationStatus extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: true})
    isNew: boolean;

    @ManyToOne(() => User, user => user.notification_status, {onDelete: "CASCADE", cascade: true})
    user: User;

    @ManyToOne(() => Notification, notification => notification.notification_status, {onDelete: "CASCADE", cascade: true})
    notification: Notification;
}