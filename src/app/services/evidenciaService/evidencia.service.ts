import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Evidencia } from '../../models/evidencia.model';
import { Servicio } from '../../models/servicio.model';
import { Novedad } from '../../models/novedad.model';

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
  // Upload image with either servicio or novedad ID
  upload(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_cinema}/evidencias/upload`, formData);
  }

  // Get image for display
  getPhotoUrl(id: number): string {
    return `${environment.url_ms_cinema}/evidencias/${id}/photo`;
  }

  // Get servicios for dropdown
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${environment.url_ms_cinema}/servicios`);
  }

  // Get novedades for dropdown
  getNovedades(): Observable<Novedad[]> {
    return this.http.get<Novedad[]>(`${environment.url_ms_cinema}/novedades`);
  }
}