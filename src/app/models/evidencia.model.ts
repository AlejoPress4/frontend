import { Novedad } from "./novedad.model";
import { Servicio } from "./servicio.model";

export class Evidencia {
    id?: number;
    ruta_archivo?: string;
    fecha_de_carga?: Date;
    id_servicio?: Servicio[];  // Frontend relationships as arrays for full entity info
    novedad_id?: Novedad[];    // Frontend relationships as arrays for full entity info
}
