import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EspecialidadMaquinaria } from '../../models/especialidad-maquinaria.model';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadMaquinariaService {

  constructor(private http: HttpClient) { }

  list(): Observable<EspecialidadMaquinaria[]> {
    return this.http.get<EspecialidadMaquinaria[]>(`${environment.url_ms_cinema}/especialidad_maquinarias`);
  }

  view(id: number): Observable<EspecialidadMaquinaria> {
    return this.http.get<EspecialidadMaquinaria>(`${environment.url_ms_cinema}/especialidad_maquinarias/${id}`);
  }

  create(newEspecialidadMaquinaria: EspecialidadMaquinaria): Observable<EspecialidadMaquinaria> {
    return this.http.post<EspecialidadMaquinaria>(`${environment.url_ms_cinema}/especialidad_maquinarias`, newEspecialidadMaquinaria);
  }

  update(theEspecialidadMaquinaria: EspecialidadMaquinaria): Observable<EspecialidadMaquinaria> {
    return this.http.put<EspecialidadMaquinaria>(`${environment.url_ms_cinema}/especialidad_maquinarias/${theEspecialidadMaquinaria.id}`, theEspecialidadMaquinaria);
  }

  delete(id: number) {
    return this.http.delete<EspecialidadMaquinaria>(`${environment.url_ms_cinema}/especialidad_maquinarias/${id}`);
  }
}