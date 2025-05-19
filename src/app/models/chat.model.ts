import { Mensaje } from "./mensaje.model";

export class Chat {
    id?: number;
    titulo?: string;
    tipo?: string;
    mensajes?: Mensaje[];
    creadoEn?: Date;
    actualizadoEn?: Date;
}
