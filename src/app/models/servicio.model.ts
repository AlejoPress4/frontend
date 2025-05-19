import { Combo } from "./combo.model";
import { Evidencia } from "./evidencia.model";
import { Cuotas } from "./cuotas.model";

export class Servicio {
    id?: number;
    costo?: number;
    f_inicio?: Date;
    f_fin?: Date;
    prioridad?: string;
    tipo?: string;
    estado?: string;
    ubicacion?: string;
    resumen?: string;
}
