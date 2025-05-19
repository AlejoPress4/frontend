import { Cuotas } from "./cuotas.model";


export class Factura {
    id?: number;
    detalle?: string;
    cuota_id?: number;
    cuota?: Cuotas;
}
