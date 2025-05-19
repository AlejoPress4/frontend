import { Departamento } from "./departamento.model";
import { Municipio } from "./municipio.model";

export class Gobernante {
    id?: number;
    id_usuario?: string;
    periodo_inicio?: Date;
    periodo_final?: Date;
    departamentos?: Departamento[];
    municipios?: Municipio[];
}
