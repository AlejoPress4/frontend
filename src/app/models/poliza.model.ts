import { Seguro } from "./seguro.model";
import { Maquina } from "./maquina.model";
import { Operario } from "./operario.model";

export class Poliza {
    id?: number;
    seguro_id!: number;
    maquina_id?: number;
    operario_id?: number;
    tipo_poliza!: string;
    fechaInicio!: Date;
    fechaFin!: Date;
}
