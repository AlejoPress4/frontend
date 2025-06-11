import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MachineCounterService } from '../services/machineCounterService/machine-counter.service';

@Injectable()
export class MachineCounterInterceptor implements HttpInterceptor {

  constructor(private machineCounterService: MachineCounterService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap({        next: (event) => {
          // Verificar si la respuesta fue exitosa y es un endpoint de máquinas
          if (this.isMachineEndpoint(req.url) && this.isSuccessfulResponse(event)) {
            console.log(`🔧 Endpoint de máquina detectado: ${req.method} ${req.url}`);
            this.machineCounterService.incrementCounter();
          }
        },
        error: (error) => {
          // Opcional: También contar errores si quieres
          // if (this.isMachineEndpoint(req.url)) {
          //   this.machineCounterService.incrementCounter();
          // }
        }
      })
    );
  }
  /**
   * Verificar si la URL corresponde a un endpoint de máquinas
   */
  private isMachineEndpoint(url: string): boolean {
    // Solo contar el endpoint específico de máquinas (no combos ni especialidades)
    // Esto detectará: GET, POST, PUT, DELETE en /maquinas
    return url.includes('/maquinas')
  }

  /**
   * Verificar si la respuesta fue exitosa
   */
  private isSuccessfulResponse(event: any): boolean {
    // Verificar si es una HttpResponse y si el status es exitoso
    return event.type === 4 && event.status >= 200 && event.status < 300;
  }
}