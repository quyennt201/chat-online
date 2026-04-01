import type { Message } from "./message";

export interface Conversation {
    _id: string;
    members: {
        _id: string;
        username: string;
    }[]
    messages: Message[]
    lastMessage: string;
    updatedAt: string;
    createdAt: string;
}