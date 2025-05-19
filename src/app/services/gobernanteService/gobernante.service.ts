import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Gobernante } from '../../models/gobernante.model';

@Injectable({
  providedIn: 'root'
})
export class GobernanteService {

  constructor(private http: HttpClient) { }

  list(): Observable<Gobernante[]> {
    return this.http.get<Gobernante[]>(`${environment.url_ms_cinema}/gobernantes`);
  }

  view(id: number): Observable<Gobernante> {
    return this.http.get<Gobernante>(`${environment.url_ms_cinema}/gobernantes/${id}`);
  }

  create(newGobernante: Gobernante): Observable<Gobernante> {
    return this.http.post<Gobernante>(`${environment.url_ms_cinema}/gobernantes`, newGobernante);
  }

  update(theGobernante: Gobernante): Observable<Gobernante> {
    return this.http.put<Gobernante>(`${environment.url_ms_cinema}/gobernantes/${theGobernante.id}`, theGobernante);
  }

  delete(id: number) {
    return this.http.delete<Gobernante>(`${environment.url_ms_cinema}/gobernantes/${id}`);
  }
}