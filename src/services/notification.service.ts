import { Injectable } from "@nestjs/common";
import { LanguageEnum } from "src/entities/enums/language.enum";
import { Notification } from "src/entities/notification.entity";

@Injectable()
export class NotificationService {

    getNotificationByUser(id: string, lang: LanguageEnum) {
        return Notification.createQueryBuilder('notification')
            .innerJoinAndSelect('notification.user', 'user')
            .where("user.id = :id AND user.language = :lang", {id, lang})
            .getMany();
    }

    async changeIsNew(id: string) {
        let notification = await Notification.findOne(id);

        notification.isNew = false;

        notification.save();

        return notification;
    }
}