import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Poliza } from '../../models/poliza.model';

@Injectable({
  providedIn: 'root'
})
export class PolizaService {

  constructor(private http: HttpClient) { }

  list(): Observable<Poliza[]> {
    return this.http.get<Poliza[]>(`${environment.url_ms_cinema}/polizas`);
  }

  view(id: number): Observable<Poliza> {
    return this.http.get<Poliza>(`${environment.url_ms_cinema}/polizas/${id}`);
  }

  create(newPoliza: Poliza): Observable<Poliza> {
    return this.http.post<Poliza>(`${environment.url_ms_cinema}/polizas`, newPoliza);
  }

  update(thePoliza: Poliza): Observable<Poliza> {
    return this.http.put<Poliza>(`${environment.url_ms_cinema}/polizas/${thePoliza.id}`, thePoliza);
  }

  delete(id: number) {
    return this.http.delete<Poliza>(`${environment.url_ms_cinema}/polizas/${id}`);
  }
}