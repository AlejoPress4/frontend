import { Gobernante } from "./gobernante.model";
import { Municipio } from "./municipio.model";

export class GobernanteMunicipio {
    id?: number;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    gobernante_id?: Gobernante[];
    municipio_id?: Municipio[];
}
