import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OperarioEspecialidad } from '../../models/operario-especialidad.model';

@Injectable({
  providedIn: 'root'
})
export class OperarioEspecialidadService {

  constructor(private http: HttpClient) { }

  list(): Observable<OperarioEspecialidad[]> {
    return this.http.get<OperarioEspecialidad[]>(`${environment.url_ms_cinema}/operario_especialidades`);
  }

  view(id: number): Observable<OperarioEspecialidad> {
    return this.http.get<OperarioEspecialidad>(`${environment.url_ms_cinema}/operario_especialidades/${id}`);
  }

  create(newSpecialtyOperator: OperarioEspecialidad): Observable<OperarioEspecialidad> {
    return this.http.post<OperarioEspecialidad>(`${environment.url_ms_cinema}/operario_especialidades`, newSpecialtyOperator);
  }

  update(theSpecialtyOperator: OperarioEspecialidad): Observable<OperarioEspecialidad> {
    return this.http.put<OperarioEspecialidad>(`${environment.url_ms_cinema}/operario_especialidades/${theSpecialtyOperator.id}`, theSpecialtyOperator);
  }

  delete(id: number) {
    return this.http.delete<OperarioEspecialidad>(`${environment.url_ms_cinema}/operario_especialidades/${id}`);
  }
}