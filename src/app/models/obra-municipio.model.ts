import { Municipio } from "./municipio.model";
import { Obra } from "./obra.model";

export class ObraMunicipio {
    id?: number;
    obra_id?: Obra[];
    municipio_id?: Municipio[];
}
