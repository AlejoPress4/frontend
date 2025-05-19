import { Maquina } from "./maquina.model";
import { Procedimiento } from "./procedimiento.model";

export class Mantenimiento {
    id?: number;
    fecha?: Date;
    estado?: string;
    maquina_id?: number;
    responsable?: string;
}
