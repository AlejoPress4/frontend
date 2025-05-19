import { Turno } from "./turno.model";

export class Novedad {
    id?: number;
    tipo?: string;
    descripcion?: string;
    evidencias?: string;
    gravedad?: string;
    turno_id?: Turno;
    turno?: Turno;
}
