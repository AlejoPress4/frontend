import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/seguridadService/seguridad.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private seguridadService: SeguridadService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (!this.seguridadService.sesionExiste()) {
      this.router.navigate(['/login']);
      return false;
    }

    const usuario = this.seguridadService.usuarioSesionActiva;
    
    if (usuario.role?.toLowerCase() === 'admin') {
      return true;
    } else {
      Swal.fire({
        title: 'Acceso Restringido',
        text: 'Solo los administradores pueden acceder a esta sección',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
