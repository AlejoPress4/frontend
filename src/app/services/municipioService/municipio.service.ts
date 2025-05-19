import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Municipio } from '../../models/municipio.model'; // Importando el modelo Municipio

@Injectable({
  providedIn: 'root'
})
// ¡Modificado aquí! Cambiamos el nombre de la clase del servicio
export class MunicipioService { // <--- Nombre de la clase del servicio cambiado a MunicipioService

  constructor(private http: HttpClient) { }

  // Dentro de la clase MunicipioService, puedes usar el modelo Municipio importado
  // para tipar tus datos, como ya lo estás haciendo correctamente:

  list(): Observable<{data: Municipio[]}> {
    return this.http.get<{ data: Municipio[] }>(`${environment.url_ms_cinema}/municipios`);
  }

  view(id: number): Observable<Municipio> {
    return this.http.get<Municipio>(`${environment.url_ms_cinema}/municipios/${id}`);
  }
}