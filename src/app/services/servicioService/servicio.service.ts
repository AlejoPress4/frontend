import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Servicio } from '../../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private http: HttpClient) { }

  list(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${environment.url_ms_cinema}/servicios`);
  }

  view(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${environment.url_ms_cinema}/servicios/${id}`);
  }

  create(newService: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(`${environment.url_ms_cinema}/servicios`, newService);
  }

  update(theService: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${environment.url_ms_cinema}/servicios/${theService.id}`, theService);
  }

  delete(id: number) {
    return this.http.delete<Servicio>(`${environment.url_ms_cinema}/servicios/${id}`);
  }
}