import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Procedimiento } from '../../models/procedimiento.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedimientoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Procedimiento[]> {
    return this.http.get<Procedimiento[]>(`${environment.url_ms_cinema}/procedimientos`);
  }

  view(id: number): Observable<Procedimiento> {
    return this.http.get<Procedimiento>(`${environment.url_ms_cinema}/procedimientos/${id}`);
  }

  create(newProcedimiento: Procedimiento): Observable<Procedimiento> {
    return this.http.post<Procedimiento>(`${environment.url_ms_cinema}/procedimientos`, newProcedimiento);
  }

  update(theProcedimiento: Procedimiento): Observable<Procedimiento> {
    return this.http.put<Procedimiento>(`${environment.url_ms_cinema}/procedimientos/${theProcedimiento.id}`, theProcedimiento);
  }

  delete(id: number) {
    return this.http.delete<Procedimiento>(`${environment.url_ms_cinema}/procedimientos/${id}`);
  }
}