import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MaquinaCombo } from '../../models/maquina-combo.model';

@Injectable({
  providedIn: 'root'
})
export class MaquinaComboService {

  constructor(private http: HttpClient) { }

  list(): Observable<MaquinaCombo[]> {
    return this.http.get<MaquinaCombo[]>(`${environment.url_ms_cinema}/maquina_combos`);
  }

  view(id: number): Observable<MaquinaCombo> {
    return this.http.get<MaquinaCombo>(`${environment.url_ms_cinema}/maquina_combos/${id}`);
  }

  create(newMaquinaCombo: MaquinaCombo): Observable<MaquinaCombo> {
    return this.http.post<MaquinaCombo>(`${environment.url_ms_cinema}/maquina_combos`, newMaquinaCombo);
  }

  update(theMaquinaCombo: MaquinaCombo): Observable<MaquinaCombo> {
    return this.http.put<MaquinaCombo>(`${environment.url_ms_cinema}/maquina_combos/${theMaquinaCombo.id}`, theMaquinaCombo);
  }

  delete(id: number) {
    return this.http.delete<MaquinaCombo>(`${environment.url_ms_cinema}/maquina_combos/${id}`);
  }
}