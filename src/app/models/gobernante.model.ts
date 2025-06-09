import { Usuario } from "./usuario.model";

export class Gobernante {
    id?: number;
    user_id?: string;
    periodoInit?: string;
    periodoEnd?: string;
    tipo?: string;
    territorio?: any;
    departamento_id?: number;
    municipio_id?: string;
}
