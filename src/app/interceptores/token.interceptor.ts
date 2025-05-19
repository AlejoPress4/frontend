import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SeguridadService } from '../services/seguridadService/seguridad.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private seguridadService: SeguridadService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No interceptar las rutas de autenticación
    if (this.isAuthRoute(request.url)) {
      return next.handle(request);
    }

    const usuario = this.seguridadService.usuarioSesionActiva;
    if (usuario && usuario.token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${usuario.token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token inválido o expirado
          this.seguridadService.logout();
          Swal.fire({
            title: 'Sesión expirada',
            text: 'Su sesión ha expirado, por favor inicie sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthRoute(url: string): boolean {
    // Lista de rutas que no requieren token
    const authRoutes = [
      '/api/public/security/login',
      '/api/public/security/login/2FA/',
      '/api/public/security/register'
    ];
    // Verificar si la URL coincide con alguna ruta de autenticación
    return authRoutes.some(route => url.toLowerCase().includes(route.toLowerCase()));
  }
}