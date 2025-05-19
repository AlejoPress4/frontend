import { Departamento } from "./departamento.model";
import { Gobernante } from "./gobernante.model";

export class GobernanteDepartamento {
    id?: number;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    gobernante_id?: Gobernante;
    departamento_id?: Departamento;
    departamento?: Departamento;
    gobernante?: Gobernante;
}
