import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoServicio } from '../../models/tipo-servicio.model';

@Injectable({
  providedIn: 'root'
})
export class TipoServicioService {

  constructor(private http: HttpClient) { }

  list(): Observable<TipoServicio[]> {
    return this.http.get<TipoServicio[]>(`${environment.url_ms_cinema}/tipo_servicios`);
  }

  view(id: number): Observable<TipoServicio> {
    return this.http.get<TipoServicio>(`${environment.url_ms_cinema}/tipo_servicios/${id}`);
  }

  create(newTipoServicio: TipoServicio): Observable<TipoServicio> {
    return this.http.post<TipoServicio>(`${environment.url_ms_cinema}/tipo_servicios`, newTipoServicio);
  }

  update(theTipoServicio: TipoServicio): Observable<TipoServicio> {
    return this.http.put<TipoServicio>(`${environment.url_ms_cinema}/tipo_servicios/${theTipoServicio.id}`, theTipoServicio);
  }

  delete(id: number) {
    return this.http.delete<TipoServicio>(`${environment.url_ms_cinema}/tipo_servicios/${id}`);
  }
}