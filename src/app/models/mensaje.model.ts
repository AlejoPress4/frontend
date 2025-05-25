import { Chat } from "./chat.model";
import { Usuario } from "./usuario.model";

export class Mensaje {
    id?: number;
    contenido?: string;
    fecha?: Date;
    hora?: Date;
    chat_id?: number;
    user_id?: Usuario[]; //falta 
    chat?: Chat; // Relación con el modelo Chat
}
