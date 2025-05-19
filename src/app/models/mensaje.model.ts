import { Chat } from "./chat.model";

export class Mensaje {
    id?: number;
    contenido?: string;
    fecha?: Date;
    chat_id?: number;
    usuario_id?: number;
}
