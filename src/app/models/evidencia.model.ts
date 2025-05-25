import { Novedad } from "./novedad.model";
import { Servicio } from "./servicio.model";

export class Evidencia {
    id?: number;
    tipo_de_archivo?: string;
    contenido_archivo?: string;
    fecha_de_carga?: Date;
    id_servicio?: Servicio[];
    novedad_id?: Novedad[];
}
