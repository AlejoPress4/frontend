import { Municipio } from "./municipio.model";

export class Obra {
    id?: number;
    nombre?: string;
    combo_id?: string;
    combo: number;
    municipios: Municipio;
}
