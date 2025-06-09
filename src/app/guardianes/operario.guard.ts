import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/seguridadService/seguridad.service';
import { AuthorizationService } from '../services/authorizationService/authorization.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OperarioGuard implements CanActivate {
  
  constructor(
    private seguridadService: SeguridadService,
    private authorizationService: AuthorizationService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (!this.seguridadService.sesionExiste()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Permitir acceso a admin y operario
    const allowedRoles = ['admin', 'operario'];
    const hasAllowedRole = this.authorizationService.hasAnyRole(allowedRoles);
    
    if (hasAllowedRole) {
      return true;
    } else {
      // Debug info para troubleshooting
      const debugInfo = this.authorizationService.debugUserInfo();
      console.warn('🚫 Acceso denegado por OperarioGuard:', {
        allowedRoles,
        isAdmin: this.authorizationService.isAdmin(),
        isOperario: this.authorizationService.isOperario(),
        userRole: debugInfo?.user?.originalRole,
        mappedRole: debugInfo?.user?.mappedRole,
        debugInfo
      });

      Swal.fire({
        title: 'Acceso Denegado',
        text: 'Solo operarios y administradores pueden acceder a esta sección',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
