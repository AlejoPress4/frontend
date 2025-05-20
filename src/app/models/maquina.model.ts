import { Combo } from "./combo.model";
import { GPS } from "./gps.model";
import { Seguro } from "./seguro.model";
import { Mantenimiento } from "./mantenimiento.model";
import { Operario } from "./operario.model";
import { Especialidad } from "./especialidad.model";

export class Maquina {
    id?: number;
    especialidad?: string;
    marca?: string;
    modelo?: string;
    estado?: string;
    ubicacion?: string;
    disponibilidad?: boolean;
    fecha_asignacion?: Date;
    fecha_retiro?: Date;
}
