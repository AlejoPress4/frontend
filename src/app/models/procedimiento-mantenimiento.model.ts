import { NumberSymbol } from "@angular/common";
import { Procedimiento } from "./procedimiento.model";
import { Mantenimiento } from "./mantenimiento.model";

export class ProcedimientoMantenimiento {
    id?: number;
    procedimiento_id?: number;
    mantenimiento_id?: number;
    estado?: string;
}
