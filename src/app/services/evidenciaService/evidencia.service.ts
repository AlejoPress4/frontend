import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Evidencia } from '../../models/evidencia.model';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {

  constructor(private http: HttpClient) { }

  list(): Observable<Evidencia[]> {
    return this.http.get<Evidencia[]>(`${environment.url_ms_cinema}/evidencias`);
  }

  view(id: number): Observable<Evidencia> {
    return this.http.get<Evidencia>(`${environment.url_ms_cinema}/evidencias/${id}`);
  }

  create(newEvidencia: Evidencia): Observable<Evidencia> {
    return this.http.post<Evidencia>(`${environment.url_ms_cinema}/evidencias`, newEvidencia);
  }

  update(theEvidencia: Evidencia): Observable<Evidencia> {
    return this.http.put<Evidencia>(`${environment.url_ms_cinema}/evidencias/${theEvidencia.id}`, theEvidencia);
  }

  delete(id: number) {
    return this.http.delete<Evidencia>(`${environment.url_ms_cinema}/evidencias/${id}`);
  }
}