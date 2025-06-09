import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/seguridadService/seguridad.service';
import { AuthorizationService } from '../services/authorizationService/authorization.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private seguridadService: SeguridadService,
    private authorizationService: AuthorizationService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Primero verificar si está autenticado
    if (!this.seguridadService.sesionExiste()) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['expectedRoles'] as string[];
    
    // Si no se especifican roles, solo verifica autenticación
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    // Verificar si el usuario tiene uno de los roles esperados usando AuthorizationService
    const hasRole = this.authorizationService.hasAnyRole(expectedRoles);

    if (hasRole) {
      return true;
    } else {
      // Debug info para troubleshooting
      const debugInfo = this.authorizationService.debugUserInfo();
      console.warn('🚫 Acceso denegado por RoleGuard:', {
        expectedRoles,
        userRole: debugInfo?.user?.originalRole,
        mappedRole: debugInfo?.user?.mappedRole,
        debugInfo
      });

      Swal.fire({
        title: 'Acceso Denegado',
        text: `No tienes permisos para acceder a esta sección. Se requiere uno de los siguientes roles: ${expectedRoles.join(', ')}`,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
