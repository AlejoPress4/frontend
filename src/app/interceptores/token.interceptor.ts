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
    const usuario = this.seguridadService.usuarioSesionActiva;

    // No interceptar las rutas de autenticación
    if (this.isAuthRoute(request.url)) {
      console.log("No se aplica token - ruta de autenticación");
      return next.handle(request);
    }

    if (usuario && usuario.token) {
      console.log("Aplicando token:", usuario.token);
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${usuario.token}`
        }
      });
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          Swal.fire({
            title: 'No está autorizado para esta operación',
            text: 'Su sesión ha expirado, por favor inicie sesión nuevamente.',
            icon: 'error',
            timer: 5000
          }).then(() => {
            this.seguridadService.logout();
            this.router.navigate(['/login']);
          });
        } else if (error.status === 400) {
          Swal.fire({
            title: 'Existe un error, contacte al administrador',
            icon: 'error',
            timer: 5000
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
      '/api/public/security/register',
      '/login',
      '/token-validation'
    ];
    // Verificar si la URL coincide con alguna ruta de autenticación
    return authRoutes.some(route => url.toLowerCase().includes(route.toLowerCase()));
  }
}