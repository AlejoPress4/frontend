import { ProcedimientoMantenimiento } from "./procedimiento-mantenimiento.model";

export class Repuesto {
    id?: number;
    nombre?: string;
    marca?: string;
    descripcion?: string;
    procedimientos?: ProcedimientoMantenimiento;
    creadoEn?: Date;
    actualizadoEn?: Date;
}
