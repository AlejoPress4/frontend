import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pago } from '../../models/pago.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(private http: HttpClient) { }
  
  create(id: number, newPago: Pago): Observable<Pago> {
    return this.http.post<Pago>(`${environment.url_ms_cinema}/cuotas/${id}/pay`, newPago);
  }
  delete(id: number) {
    return this.http.delete<Pago>(`${environment.url_ms_cinema}/cuotas/${id}/pay`);
  }
}
