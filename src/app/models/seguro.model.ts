import { Poliza } from "./poliza.model";

export class Seguro {
    id?: number;
    nombre?: string;
    descripcion?: string;
    poliza: Poliza[];
}
