import { TipoServicio } from "./tipo-servicio.model";

export class EspecialidadMaquinaria {
    id?: number;
    tipo_servicio_id?: number; // Cambiado a number para reflejar el backend
    tipo_trabajo?: string;
    maquina_id?: number; // Nuevo atributo para el ID de la máquina
    especialidad_id?: number; // Nuevo atributo para el ID de la especialidad
}
