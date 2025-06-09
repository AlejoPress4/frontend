import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/seguridadService/seguridad.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AutenticadoGuard implements CanActivate {
  constructor(
    private seguridadService: SeguridadService,
    private router: Router
  ) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.seguridadService.sesionExiste()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
