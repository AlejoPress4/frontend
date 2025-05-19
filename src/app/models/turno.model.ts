import { Novedad } from "./novedad.model";

export class Turno {
    id?: number;
    fecha?: Date;
    operario_id?: number;
    maquina_id?: number;
    novedades?: Novedad[];
}
