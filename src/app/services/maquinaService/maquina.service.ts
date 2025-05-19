import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Maquina } from '../../models/maquina.model'; // Importando el modelo Maquina

@Injectable({
  providedIn: 'root'
})
// ¡Modificado aquí! Cambiamos el nombre de la clase del servicio
export class MaquinaService { // <--- Nombre de la clase del servicio cambiado a MaquinaService

  constructor(private http: HttpClient) { }

  // Dentro de la clase MaquinaService, puedes usar el modelo Maquina importado
  // para tipar tus datos, como ya lo estás haciendo correctamente:

  list(): Observable<Maquina[]> {
    return this.http.get<Maquina[]>(`${environment.url_ms_cinema}/maquinas`);
  }

  view(id: number): Observable<Maquina> {
    return this.http.get<Maquina>(`${environment.url_ms_cinema}/maquinas/${id}`);
  }

  create(newMaquina: Maquina): Observable<Maquina> {
    return this.http.post<Maquina>(`${environment.url_ms_cinema}/maquinas`, newMaquina);
  }

  update(theMaquina: Maquina): Observable<Maquina> {
    return this.http.put<Maquina>(`${environment.url_ms_cinema}/maquinas/${theMaquina.id}`, theMaquina);
  }

  delete(id: number) {
    return this.http.delete<Maquina>(`${environment.url_ms_cinema}/maquinas/${id}`);
  }
}