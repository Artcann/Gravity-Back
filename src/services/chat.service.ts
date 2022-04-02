import { Injectable } from "@nestjs/common";
import { Chat } from "src/entities/chat.entity";

@Injectable()
export class ChatService {


    getChats(id: string) {
        const chat = Chat.createQueryBuilder('chat')
            .innerJoin('chat.user', 'user')
            .where('user.id = :id', {id: id})
            .getMany();

        return chat;
    }
}