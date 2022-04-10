import { Injectable } from "@nestjs/common";
import { GroupEnum } from "src/entities/enums/group.enum";
import { LanguageEnum } from "src/entities/enums/language.enum";
import { Group } from "src/entities/group.entity";
import { Notification } from "src/entities/notification.entity";
import * as firebase_admin from "firebase-admin";
import { NotificationStatus } from "src/entities/notification-status.entity";
import { CreateNotificationDto } from "src/dto/notification/create-notification.dto";
import { SendNotificationDto } from "src/dto/notification/send-notification.dto";
import { User } from "src/entities/user.entity";

@Injectable()
export class NotificationService {

    async create(createNotificationDto: CreateNotificationDto) {
        const notification = Notification.create(createNotificationDto);

        await notification.save();

        return notification;
    }

    getNotifications() {
        return Notification.find();
    }

    getNotificationByUser(id: string, lang: LanguageEnum) {
        return Notification.createQueryBuilder('notification')
            .leftJoin('notification.notification_status', 'status')
            .leftJoin("status.user", "user")
            .select(["notification.content", "status.id", "notification.title", "status.isNew", "notification.action", "notification.url"])
            .where("user.id = :id AND user.language = :lang", {id, lang})
            .getMany();
    }

    async changeIsNew(id: string) {
        let notification = await NotificationStatus.findOne(id);

        notification.isNew = false;
        notification.save();

        return notification;
    }

    async sendNotificationToGroup(notificationId: string, group: GroupEnum) {
        const deviceTokenRaw = await Group.createQueryBuilder("group")
            .leftJoinAndSelect("group.user", "user")
            .where("group.groupLabel = :group", {group: group})
            .getOne();

        let tokens = [];
        let status = [];
        const notification = await Notification.findOne(notificationId);
        deviceTokenRaw.user.forEach(user => {
            if(user.deviceToken !== null) { 
                tokens.push(user.deviceToken);
                status.push({
                    user: user,
                    notification: notification,
                })
            }
        });

        NotificationStatus.save(status);



        

        return await firebase_admin.messaging().sendMulticast({
            tokens,
            "notification": {
                "title": notification.title,
                "body": notification.content
            }
        })
        }

        async sendNotificationToGroupCustomNotification(group: GroupEnum, notification: Notification) {
            const deviceTokenRaw = await Group.createQueryBuilder("group")
                .leftJoinAndSelect("group.user", "user")
                .where("group.groupLabel = :group", {group: group})
                .getOne();
    
            let tokens = [];
            let status = [];
            deviceTokenRaw.user.forEach(user => {
                if(user.deviceToken !== null) { 
                    tokens.push(user.deviceToken);
                    status.push({
                        user: user,
                        notification: notification,
                    })
                }
            });
    
            NotificationStatus.save(status);
    
            return await firebase_admin.messaging().sendMulticast({
                tokens,
                "notification": {
                    "title": notification.title,
                    "body": notification.content
                }
            })
            }
    

    async sendNotificationToUser(userId: number, notification: Notification) {
        const user = await User.findOne(userId);

        const tokens = [user.deviceToken];

        return await firebase_admin.messaging().sendMulticast({
            tokens,
            "notification": {
                "title": notification.title,
                "body": notification.content
            }
        })
    }

    async sendNotificationToDevice(notificationId: string, deviceToken: string) {
        const notification = await Notification.findOne(notificationId);

        const tokens = [deviceToken];

        return await firebase_admin.messaging().sendMulticast({
            tokens,
            "notification": {
                "title": notification.title,
                "body": notification.content
            }
        })
    }
}