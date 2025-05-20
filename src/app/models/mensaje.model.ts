import { Chat } from "./chat.model";

export class Mensaje {
    id?: number;
    contenido?: string;
    fecha?: Date;
    hora?: Date;
    chat_id?: number;
    user_id?: string;
}
