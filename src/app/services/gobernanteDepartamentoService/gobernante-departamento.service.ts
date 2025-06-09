import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gobernante } from 'src/app/models/gobernante.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GobernanteDepartamentoService {
  constructor(private http: HttpClient) { }

  list(): Observable<Gobernante[]> {
    return this.http.get<Gobernante[]>(`${environment.url_ms_cinema}/gobernantes_departamentos`);
  }

  view(id: number): Observable<Gobernante> {
    return this.http.get<Gobernante>(`${environment.url_ms_cinema}/gobernantes_departamentos/${id}`);
  }

  create(newGobernante: Gobernante): Observable<Gobernante> {
    return this.http.post<Gobernante>(`${environment.url_ms_cinema}/gobernantes_departamentos`, newGobernante);
  }

  update(theGobernante: Gobernante): Observable<Gobernante> {
    return this.http.put<Gobernante>(`${environment.url_ms_cinema}/gobernantes_departamentos/${theGobernante.id}`, theGobernante);
  }

  delete(id: number) {
    return this.http.delete<Gobernante>(`${environment.url_ms_cinema}/gobernantes_departamentos/${id}`);
  }
}
