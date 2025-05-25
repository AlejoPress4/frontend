import { Usuario } from "./usuario.model";

export class Gobernante {
    id?: number;
    id_usuario?: Usuario;
    periodo_inicio?: Date;
    periodo_final?: Date;
}
