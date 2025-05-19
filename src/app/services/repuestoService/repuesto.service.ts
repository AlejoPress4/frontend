import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Repuesto } from '../../models/repuesto.model';

@Injectable({
  providedIn: 'root'
})
export class RepuestoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Repuesto[]> {
    return this.http.get<Repuesto[]>(`${environment.url_ms_cinema}/repuesto`);
  }

  view(id: number): Observable<Repuesto> {
    return this.http.get<Repuesto>(`${environment.url_ms_cinema}/repuesto/${id}`);
  }

  create(newRepuesto: Repuesto): Observable<Repuesto> {
    return this.http.post<Repuesto>(`${environment.url_ms_cinema}/repuesto`, newRepuesto);
  }

  update(theRepuesto: Repuesto): Observable<Repuesto> {
    return this.http.put<Repuesto>(`${environment.url_ms_cinema}/repuesto/${theRepuesto.id}`, theRepuesto);
  }

  delete(id: number) {
    return this.http.delete<Repuesto>(`${environment.url_ms_cinema}/repuesto/${id}`);
  }
}