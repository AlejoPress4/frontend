import { Novedad } from "./novedad.model";
import { Servicio } from "./servicio.model";

export class Evidencia {
    id?: number;
    tipo_archivo?: string;
    contenido_archivo?: string;
    fecha_carga?: Date;
    servicio_id?: number;
    novedad_id?: number;
    servicio?: Servicio;
    novedad?: Novedad;
}
