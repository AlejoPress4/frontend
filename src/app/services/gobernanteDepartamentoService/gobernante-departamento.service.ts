import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GobernanteDepartamento } from 'src/app/models/gobernante-departamento.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GobernanteDepartamentoService {
  constructor(private http: HttpClient) { }

  list(): Observable<GobernanteDepartamento[]> {
    return this.http.get<GobernanteDepartamento[]>(`${environment.url_ms_cinema}/gobernantes_departamentos`);
  }

  view(id: number): Observable<GobernanteDepartamento> {
    return this.http.get<GobernanteDepartamento>(`${environment.url_ms_cinema}/gobernantes_departamentos/${id}`);
  }

  create(newGobernanteDepartamento: GobernanteDepartamento): Observable<GobernanteDepartamento> {
    return this.http.post<GobernanteDepartamento>(`${environment.url_ms_cinema}/gobernantes_departamentos`, newGobernanteDepartamento);
  }

  update(theGobernanteDepartamento: GobernanteDepartamento): Observable<GobernanteDepartamento> {
    return this.http.put<GobernanteDepartamento>(`${environment.url_ms_cinema}/gobernantes_departamentos/${theGobernanteDepartamento.id}`, theGobernanteDepartamento);
  }

  delete(id: number) {
    return this.http.delete<GobernanteDepartamento>(`${environment.url_ms_cinema}/gobernantes_departamentos/${id}`);
  }
}
