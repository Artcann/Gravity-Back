import { Injectable } from "@nestjs/common";
import { Chat } from "src/entities/chat.entity";

@Injectable()
export class ChatService {


    getChats(id: string) {
        const chat = Chat.createQueryBuilder('chat')
            .innerJoin('chat.user', 'user')
            .where('user.id = :id', {id: id})
            .orderBy('chat.id', "ASC")
            .getMany();

        return chat;
    }

    getConnectedUsers() {
        return Chat.createQueryBuilder('chat')
            .leftJoinAndSelect('chat.user', 'user')
            .distinctOn(['user.id'])
            .getMany();
    }
}