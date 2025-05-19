import { Chat } from "./chat.model";

export class Mensaje {
    id?: number;
    contenido?: string;
    fecha?: Date;
    id_chat?: number;
    id_usuario?: number;
    chat?: Chat;
}
