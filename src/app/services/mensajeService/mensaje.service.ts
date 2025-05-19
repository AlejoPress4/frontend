import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mensaje } from '../../models/mensaje.model';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private http: HttpClient) { }

  list(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${environment.url_ms_cinema}/mensajes`);
  }

  view(id: number): Observable<Mensaje> {
    return this.http.get<Mensaje>(`${environment.url_ms_cinema}/mensajes/${id}`);
  }

  create(newMensaje: Mensaje): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${environment.url_ms_cinema}/mensajes`, newMensaje);
  }

  update(theMensaje: Mensaje): Observable<Mensaje> {
    return this.http.put<Mensaje>(`${environment.url_ms_cinema}/mensajes/${theMensaje.id}`, theMensaje);
  }

  delete(id: number) {
    return this.http.delete<Mensaje>(`${environment.url_ms_cinema}/mensajes/${id}`);
  }
}