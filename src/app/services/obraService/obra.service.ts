import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Obra } from '../../models/obra.model';

@Injectable({
  providedIn: 'root'
})
export class ObraService {

  constructor(private http: HttpClient) { }

  list(): Observable<Obra[]> {
    return this.http.get<Obra[]>(`${environment.url_ms_cinema}/obras`);
  }

  view(id: number): Observable<Obra> {
    return this.http.get<Obra>(`${environment.url_ms_cinema}/obras/${id}`);
  }

  create(newObra: Obra): Observable<Obra> {
    return this.http.post<Obra>(`${environment.url_ms_cinema}/obras`, newObra);
  }

  update(theObra: Obra): Observable<Obra> {
    return this.http.put<Obra>(`${environment.url_ms_cinema}/obras/${theObra.id}`, theObra);
  }

  delete(id: number) {
    return this.http.delete<Obra>(`${environment.url_ms_cinema}/obras/${id}`);
  }
}