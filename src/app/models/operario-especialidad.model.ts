import { Especialidad } from "./especialidad.model";
import { Operario } from "./operario.model";

export class OperarioEspecialidad {
    id?: number;
    operario_id?:Operario;
    especialidad_id?:Especialidad;
    nivel_experiencia?: string;
}
