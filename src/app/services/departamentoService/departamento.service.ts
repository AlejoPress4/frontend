import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Departamento } from '../../models/departamento.model'; // Importando el modelo Departamento

@Injectable({
  providedIn: 'root'
})
// ¡Modificado aquí! Cambiamos el nombre de la clase del servicio
export class DepartamentoService { // <--- Nombre de la clase del servicio cambiado a DepartamentoService

  constructor(private http: HttpClient) { }

  // Dentro de la clase DepartamentoService, puedes usar el modelo Departamento importado
  // para tipar tus datos, como ya lo estás haciendo correctamente:

  list(): Observable<{ data: Departamento[] }> {
    return this.http.get<{ data: Departamento[] }>(`${environment.url_ms_cinema}/departamentos`);
  }

  view(id: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${environment.url_ms_cinema}/departamentos/${id}`);
  }
}